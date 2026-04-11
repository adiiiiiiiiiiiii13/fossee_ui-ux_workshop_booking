import csv
from datetime import timedelta

import pandas as pd
from django.contrib import messages
from django.core.paginator import Paginator
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.http import require_GET

from teams.models import Team
from workshop_app.api_views import _current_user_payload, _is_instructor
from workshop_app.models import Workshop, WorkshopType, states


def _serialize_stat_workshop(workshop):
    return {
        "id": workshop.id,
        "coordinatorName": workshop.coordinator.get_full_name().strip() or workshop.coordinator.username,
        "institute": workshop.coordinator.profile.institute,
        "instructorName": workshop.instructor.get_full_name().strip() if workshop.instructor_id else "",
        "workshopName": workshop.workshop_type.name,
        "workshopDate": workshop.date.isoformat(),
        "state": workshop.coordinator.profile.state,
        "status": workshop.status,
    }


@require_GET
def public_stats_api(request):
    from_date = request.GET.get("from_date")
    to_date = request.GET.get("to_date")
    state = request.GET.get("state")
    workshop_type = request.GET.get("workshop_type")
    show_workshops = request.GET.get("show_workshops")
    sort = request.GET.get("sort") or "date"
    page = request.GET.get("page") or 1

    if from_date and to_date:
        workshops = Workshop.objects.filter(date__range=(from_date, to_date), status=1).order_by(sort)
        if state:
            workshops = workshops.filter(coordinator__profile__state=state)
        if workshop_type:
            workshops = workshops.filter(workshop_type_id=workshop_type)
    else:
        today = timezone.now().date()
        upto = today + timedelta(days=15)
        workshops = Workshop.objects.filter(date__range=(today, upto), status=1).order_by("date")

    if show_workshops and request.user.is_authenticated and hasattr(request.user, "profile"):
        if _is_instructor(request.user):
            workshops = workshops.filter(instructor=request.user)
        else:
            workshops = workshops.filter(coordinator=request.user)

    ws_states, ws_count = Workshop.objects.get_workshops_by_state(workshops)
    ws_type, ws_type_count = Workshop.objects.get_workshops_by_type(workshops)

    paginator = Paginator(workshops, 20)
    page_obj = paginator.get_page(page)
    filters = {
        "states": [{"value": key, "label": value} for key, value in states if key],
        "workshopTypes": [
            {"value": workshop.id, "label": workshop.name}
            for workshop in WorkshopType.objects.order_by("name")
        ],
    }

    return JsonResponse(
        {
            "ok": True,
            "data": {
                "items": [_serialize_stat_workshop(workshop) for workshop in page_obj.object_list],
                "pagination": {
                    "page": page_obj.number,
                    "totalPages": paginator.num_pages,
                    "hasNext": page_obj.has_next(),
                    "hasPrevious": page_obj.has_previous(),
                    "totalItems": paginator.count,
                },
                "charts": {
                    "state": {"labels": ws_states, "values": ws_count},
                    "type": {"labels": ws_type, "values": ws_type_count},
                },
                "filters": filters,
                "user": _current_user_payload(request.user),
            },
        }
    )


@require_GET
def public_stats_export_api(request):
    from_date = request.GET.get("from_date")
    to_date = request.GET.get("to_date")
    state = request.GET.get("state")
    workshop_type = request.GET.get("workshop_type")
    sort = request.GET.get("sort") or "date"

    workshops = Workshop.objects.filter(status=1).order_by(sort)
    if from_date and to_date:
        workshops = workshops.filter(date__range=(from_date, to_date))
    if state:
        workshops = workshops.filter(coordinator__profile__state=state)
    if workshop_type:
        workshops = workshops.filter(workshop_type_id=workshop_type)

    data = workshops.values(
        "workshop_type__name",
        "coordinator__first_name",
        "coordinator__last_name",
        "instructor__first_name",
        "instructor__last_name",
        "coordinator__profile__state",
        "date",
        "status",
    )
    df = pd.DataFrame(list(data))
    if not df.empty:
        df.status.replace([0, 1, 2], ["Pending", "Success", "Reject"], inplace=True)
        codes, state_labels = list(zip(*states))
        df.coordinator__profile__state.replace(codes, state_labels, inplace=True)

    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = "attachment; filename=statistics.csv"
    if df.empty:
        writer = csv.writer(response)
        writer.writerow(["message"])
        writer.writerow(["No data found"])
        return response

    df.to_csv(response, index=False)
    return response


@require_GET
def team_stats_api(request, team_id=None):
    if not request.user.is_authenticated or not hasattr(request.user, "profile"):
        return JsonResponse({"ok": False, "message": "Authentication required"}, status=401)

    teams = Team.objects.prefetch_related("members__user").all()
    team = get_object_or_404(teams, id=team_id) if team_id else teams.first()
    if team is None:
        return JsonResponse({"ok": True, "data": {"teams": [], "selectedTeam": None, "chart": {"labels": [], "values": []}}})

    if not team.members.filter(user_id=request.user.id).exists():
        messages.add_message(request, messages.INFO, "You are not added to the team")
        return JsonResponse({"ok": False, "message": "You are not added to this team"}, status=403)

    member_workshop_data = {}
    for member in team.members.all():
        workshop_count = Workshop.objects.filter(instructor_id=member.user.id).count()
        member_workshop_data[member.user.get_full_name().strip() or member.user.username] = workshop_count

    return JsonResponse(
        {
            "ok": True,
            "data": {
                "teams": [{"id": item.id, "label": f"Team {index + 1}"} for index, item in enumerate(teams)],
                "selectedTeam": {"id": team.id},
                "chart": {
                    "labels": list(member_workshop_data.keys()),
                    "values": list(member_workshop_data.values()),
                },
            },
        }
    )
