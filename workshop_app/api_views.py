import json
import os
from datetime import datetime
from functools import wraps

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_http_methods

from workshop_app.forms import (
    CommentsForm,
    ProfileForm,
    UserRegistrationForm,
    WorkshopForm,
    WorkshopTypeForm,
)
from workshop_app.models import (
    AttachmentFile,
    Profile,
    Workshop,
    WorkshopType,
    department_choices,
    position_choices,
    source,
    states,
    title,
)
from workshop_app.send_mails import send_email


def _json_error(message, status=400, errors=None):
    payload = {"ok": False, "message": message}
    if errors:
        payload["errors"] = errors
    return JsonResponse(payload, status=status)


def _form_errors(form):
    return {field: [str(error) for error in errors] for field, errors in form.errors.items()}


def _request_data(request):
    if request.content_type and "application/json" in request.content_type:
        try:
            return json.loads(request.body.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            return {}
    return request.POST


def _choice_list(choices):
    return [{"value": key, "label": value} for key, value in choices if key != ""]


def _serialize_attachment(file_obj):
    return {
        "id": file_obj.id,
        "name": os.path.basename(file_obj.attachments.name),
        "url": file_obj.attachments.url if file_obj.attachments else "",
    }


def _serialize_profile(profile):
    return {
        "id": profile.user_id,
        "title": profile.title,
        "firstName": profile.user.first_name,
        "lastName": profile.user.last_name,
        "fullName": profile.user.get_full_name().strip() or profile.user.username,
        "username": profile.user.username,
        "email": profile.user.email,
        "institute": profile.institute,
        "department": profile.department,
        "phoneNumber": profile.phone_number,
        "position": profile.position,
        "location": profile.location,
        "state": profile.state,
        "isEmailVerified": profile.is_email_verified,
    }


def _serialize_workshop_type(workshop_type, include_attachments=False):
    payload = {
        "id": workshop_type.id,
        "name": workshop_type.name,
        "description": workshop_type.description,
        "duration": workshop_type.duration,
        "termsAndConditions": workshop_type.terms_and_conditions,
    }
    if include_attachments:
        payload["attachments"] = [
            _serialize_attachment(file_obj)
            for file_obj in AttachmentFile.objects.filter(workshop_type=workshop_type)
        ]
    return payload


def _serialize_comment(comment):
    return {
        "id": comment.id,
        "authorId": comment.author_id,
        "authorName": comment.author.get_full_name().strip() or comment.author.username,
        "comment": comment.comment,
        "public": comment.public,
        "createdDate": timezone.localtime(comment.created_date).isoformat(),
    }


def _serialize_workshop(workshop, include_comments=False):
    payload = {
        "id": workshop.id,
        "uid": str(workshop.uid),
        "date": workshop.date.isoformat(),
        "status": workshop.status,
        "statusLabel": workshop.get_status(),
        "tncAccepted": workshop.tnc_accepted,
        "coordinator": {
            "id": workshop.coordinator_id,
            "name": workshop.coordinator.get_full_name().strip() or workshop.coordinator.username,
            "email": workshop.coordinator.email,
            "institute": getattr(workshop.coordinator.profile, "institute", ""),
            "phoneNumber": getattr(workshop.coordinator.profile, "phone_number", ""),
            "state": getattr(workshop.coordinator.profile, "state", ""),
        },
        "instructor": None,
        "workshopType": {
            "id": workshop.workshop_type_id,
            "name": workshop.workshop_type.name,
            "duration": workshop.workshop_type.duration,
        },
    }
    if workshop.instructor_id:
        payload["instructor"] = {
            "id": workshop.instructor_id,
            "name": workshop.instructor.get_full_name().strip() or workshop.instructor.username,
            "email": workshop.instructor.email,
            "phoneNumber": getattr(workshop.instructor.profile, "phone_number", ""),
        }
    if include_comments:
        comments = workshop.comment_set.order_by("-created_date")
        payload["comments"] = [_serialize_comment(comment) for comment in comments]
    return payload


def _paginate(queryset, page_number, serializer, page_size=10):
    paginator = Paginator(queryset, page_size)
    page = paginator.get_page(page_number or 1)
    return {
        "items": [serializer(item) for item in page.object_list],
        "pagination": {
            "page": page.number,
            "totalPages": paginator.num_pages,
            "pageSize": page_size,
            "totalItems": paginator.count,
            "hasNext": page.has_next(),
            "hasPrevious": page.has_previous(),
        },
    }


def _is_instructor(user):
    return user.groups.filter(name="instructor").exists()


def _current_user_payload(user):
    if not user.is_authenticated or not hasattr(user, "profile"):
        return None
    profile = user.profile
    return {
        "id": user.id,
        "username": user.username,
        "name": user.get_full_name().strip() or user.username,
        "email": user.email,
        "position": profile.position,
        "isInstructor": _is_instructor(user),
        "isEmailVerified": profile.is_email_verified,
        "profile": _serialize_profile(profile),
    }


def api_login_required(view_func):
    @wraps(view_func)
    def wrapped(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return _json_error("Authentication required", status=401)
        if not hasattr(request.user, "profile"):
            return _json_error("Profile not found", status=403)
        return view_func(request, *args, **kwargs)

    return wrapped


@require_GET
def choices_api(request):
    workshop_types = WorkshopType.objects.order_by("name")
    return JsonResponse(
        {
            "ok": True,
            "data": {
                "titles": _choice_list(title),
                "departments": _choice_list(department_choices),
                "positions": _choice_list(position_choices),
                "sources": _choice_list(source),
                "states": _choice_list(states),
                "workshopTypes": [
                    {
                        "id": workshop_type.id,
                        "name": workshop_type.name,
                        "duration": workshop_type.duration,
                    }
                    for workshop_type in workshop_types
                ],
            },
        }
    )


@ensure_csrf_cookie
@require_GET
def session_api(request):
    return JsonResponse(
        {
            "ok": True,
            "data": {
                "user": _current_user_payload(request.user),
            },
        }
    )


@require_http_methods(["POST"])
def login_api(request):
    data = _request_data(request)
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    user = authenticate(username=username, password=password)

    if not user:
        return _json_error("Invalid username or password", status=400)
    if not hasattr(user, "profile") or not user.profile.is_email_verified:
        return _json_error("Please activate your account before logging in", status=403)

    login(request, user)
    return JsonResponse(
        {
            "ok": True,
            "message": "Login successful",
            "data": {"user": _current_user_payload(user)},
        }
    )


@require_http_methods(["POST"])
def register_api(request):
    form = UserRegistrationForm(_request_data(request))
    if not form.is_valid():
        return _json_error("Registration failed", status=400, errors=_form_errors(form))

    username, password, key = form.save()
    new_user = Profile.objects.select_related("user").get(user__username=username).user
    send_email(
        request,
        call_on="Registration",
        user_position=new_user.profile.position,
        other_email=new_user.email,
        key=key,
    )
    payload_data = {
        "username": username,
        "activationRequired": True,
    }
    if settings.DEBUG:
        base = getattr(settings, "PRODUCTION_URL", "http://localhost:8000").rstrip("/")
        payload_data["devActivationUrl"] = f"{base}/workshop/activate_user/{key}"
    return JsonResponse(
        {
            "ok": True,
            "message": "Registration successful. Please check your email to activate your account.",
            "data": payload_data,
        },
        status=201,
    )


@require_http_methods(["POST"])
def logout_api(request):
    logout(request)
    return JsonResponse({"ok": True, "message": "Logged out successfully"})


@api_login_required
@require_GET
def status_api(request):
    user = request.user
    today = timezone.localdate()

    if _is_instructor(user):
        accepted = Workshop.objects.filter(instructor=user, status=1).order_by("date")
        pending = Workshop.objects.filter(status=0).order_by("date")
        dashboard_type = "instructor"
    else:
        accepted = Workshop.objects.filter(coordinator=user, status=1).order_by("-date")
        pending = Workshop.objects.filter(coordinator=user, status=0).order_by("-date")
        dashboard_type = "coordinator"

    return JsonResponse(
        {
            "ok": True,
            "data": {
                "dashboardType": dashboard_type,
                "today": today.isoformat(),
                "accepted": [_serialize_workshop(workshop) for workshop in accepted],
                "pending": [_serialize_workshop(workshop) for workshop in pending],
            },
        }
    )


@api_login_required
@require_http_methods(["POST"])
def propose_workshop_api(request):
    if _is_instructor(request.user):
        return _json_error("Only coordinators can propose workshops", status=403)

    form = WorkshopForm(_request_data(request))
    if not form.is_valid():
        return _json_error("Unable to propose workshop", status=400, errors=_form_errors(form))

    form_data = form.save(commit=False)
    form_data.coordinator = request.user
    duplicate_exists = Workshop.objects.filter(
        date=form_data.date,
        workshop_type=form_data.workshop_type,
        coordinator=form_data.coordinator,
    ).exists()
    if duplicate_exists:
        return _json_error("You have already proposed this workshop on the selected date", status=409)

    form_data.save()
    instructors = Profile.objects.select_related("user").filter(position="instructor")
    for instructor in instructors:
        send_email(
            request,
            call_on="Proposed Workshop",
            user_position="instructor",
            workshop_date=str(form_data.date),
            workshop_title=form_data.workshop_type,
            user_name=request.user.get_full_name(),
            other_email=instructor.user.email,
            phone_number=request.user.profile.phone_number,
            institute=request.user.profile.institute,
        )

    return JsonResponse(
        {
            "ok": True,
            "message": "Workshop proposed successfully",
            "data": {"workshop": _serialize_workshop(form_data)},
        },
        status=201,
    )


@require_GET
def workshop_types_api(request):
    page = request.GET.get("page", 1)
    queryset = WorkshopType.objects.order_by("id")
    payload = _paginate(queryset, page, _serialize_workshop_type, page_size=8)
    return JsonResponse({"ok": True, "data": payload})


@api_login_required
@require_http_methods(["POST"])
def workshop_type_create_api(request):
    if not _is_instructor(request.user):
        return _json_error("Only instructors can add workshop types", status=403)

    form = WorkshopTypeForm(request.POST)
    if not form.is_valid():
        return _json_error("Unable to create workshop type", status=400, errors=_form_errors(form))

    workshop_type = form.save()
    for uploaded_file in request.FILES.getlist("attachments"):
        AttachmentFile.objects.create(workshop_type=workshop_type, attachments=uploaded_file)
    return JsonResponse(
        {
            "ok": True,
            "message": "Workshop type created successfully",
            "data": {"workshopType": _serialize_workshop_type(workshop_type, include_attachments=True)},
        },
        status=201,
    )


@require_GET
def workshop_type_detail_api(request, workshop_type_id):
    workshop_type = get_object_or_404(WorkshopType, id=workshop_type_id)
    return JsonResponse(
        {
            "ok": True,
            "data": {"workshopType": _serialize_workshop_type(workshop_type, include_attachments=True)},
        }
    )


@api_login_required
@require_http_methods(["POST"])
def workshop_type_update_api(request, workshop_type_id):
    if not _is_instructor(request.user):
        return _json_error("Only instructors can edit workshop types", status=403)

    workshop_type = get_object_or_404(WorkshopType, id=workshop_type_id)
    form = WorkshopTypeForm(request.POST, instance=workshop_type)
    if not form.is_valid():
        return _json_error("Unable to update workshop type", status=400, errors=_form_errors(form))

    workshop_type = form.save()
    for uploaded_file in request.FILES.getlist("attachments"):
        AttachmentFile.objects.create(workshop_type=workshop_type, attachments=uploaded_file)

    return JsonResponse(
        {
            "ok": True,
            "message": "Workshop type updated successfully",
            "data": {"workshopType": _serialize_workshop_type(workshop_type, include_attachments=True)},
        }
    )


@api_login_required
@require_http_methods(["POST"])
def attachment_delete_api(request, workshop_type_id, file_id):
    if not _is_instructor(request.user):
        return _json_error("Only instructors can delete attachments", status=403)

    file_obj = get_object_or_404(AttachmentFile, id=file_id, workshop_type_id=workshop_type_id)
    if file_obj.attachments and os.path.exists(file_obj.attachments.path):
        os.remove(file_obj.attachments.path)
    file_obj.delete()
    return JsonResponse({"ok": True, "message": "Attachment deleted successfully"})


@require_GET
def workshop_tnc_api(request, workshop_type_id):
    workshop_type = get_object_or_404(WorkshopType, id=workshop_type_id)
    return JsonResponse({"ok": True, "data": {"tnc": workshop_type.terms_and_conditions}})


@api_login_required
@require_GET
def workshop_detail_api(request, workshop_id):
    workshop = get_object_or_404(Workshop.objects.select_related("coordinator__profile", "instructor__profile", "workshop_type"), id=workshop_id)
    payload = _serialize_workshop(workshop, include_comments=True)
    if not _is_instructor(request.user):
        payload["comments"] = [comment for comment in payload["comments"] if comment["public"]]
    return JsonResponse({"ok": True, "data": {"workshop": payload}})


@api_login_required
@require_http_methods(["POST"])
def workshop_comment_api(request, workshop_id):
    workshop = get_object_or_404(Workshop, id=workshop_id)
    form = CommentsForm(_request_data(request))
    if not form.is_valid():
        return _json_error("Unable to post comment", status=400, errors=_form_errors(form))

    comment = form.save(commit=False)
    if not _is_instructor(request.user):
        comment.public = True
    comment.author = request.user
    comment.created_date = timezone.now()
    comment.workshop = workshop
    comment.save()

    return JsonResponse(
        {
            "ok": True,
            "message": "Comment posted successfully",
            "data": {"comment": _serialize_comment(comment)},
        },
        status=201,
    )


@api_login_required
@require_http_methods(["POST"])
def accept_workshop_api(request, workshop_id):
    if not _is_instructor(request.user):
        return _json_error("Only instructors can accept workshops", status=403)

    workshop = get_object_or_404(Workshop.objects.select_related("coordinator__profile", "workshop_type"), id=workshop_id)
    workshop.status = 1
    workshop.instructor = request.user
    workshop.save()
    messages.add_message(request, messages.SUCCESS, "Workshop accepted!")

    coordinator_profile = workshop.coordinator.profile
    send_email(
        request,
        call_on="Booking Confirmed",
        user_position="instructor",
        workshop_date=str(workshop.date),
        workshop_title=workshop.workshop_type.name,
        user_name=workshop.coordinator.get_full_name(),
        other_email=workshop.coordinator.email,
        phone_number=coordinator_profile.phone_number,
        institute=coordinator_profile.institute,
    )
    send_email(
        request,
        call_on="Booking Confirmed",
        workshop_date=str(workshop.date),
        workshop_title=workshop.workshop_type.name,
        other_email=workshop.coordinator.email,
        phone_number=request.user.profile.phone_number,
    )

    return JsonResponse(
        {
            "ok": True,
            "message": "Workshop accepted successfully",
            "data": {"workshop": _serialize_workshop(workshop)},
        }
    )


@api_login_required
@require_http_methods(["POST"])
def reschedule_workshop_api(request, workshop_id):
    if not _is_instructor(request.user):
        return _json_error("Only instructors can reschedule workshops", status=403)

    workshop = get_object_or_404(Workshop, id=workshop_id)
    data = _request_data(request)
    new_date_raw = data.get("new_date")
    if not new_date_raw:
        return _json_error("New date is required", status=400)

    try:
        new_date = datetime.strptime(new_date_raw, "%Y-%m-%d").date()
    except ValueError:
        return _json_error("Invalid date format", status=400)

    if new_date < timezone.localdate():
        return _json_error("Workshop date cannot be in the past", status=400)

    previous_date = workshop.date
    workshop.date = new_date
    workshop.save(update_fields=["date"])

    send_email(
        request,
        call_on="Change Date",
        user_position="instructor",
        workshop_date=str(previous_date),
        new_workshop_date=str(new_date),
    )
    send_email(
        request,
        call_on="Change Date",
        workshop_date=str(previous_date),
        new_workshop_date=str(new_date),
        other_email=workshop.coordinator.email,
    )

    return JsonResponse(
        {
            "ok": True,
            "message": "Workshop date updated successfully",
            "data": {"workshop": _serialize_workshop(workshop)},
        }
    )


@api_login_required
@require_GET
def own_profile_api(request):
    return JsonResponse({"ok": True, "data": {"profile": _serialize_profile(request.user.profile)}})


@api_login_required
@require_http_methods(["POST"])
def own_profile_update_api(request):
    data = _request_data(request)
    form = ProfileForm(data, user=request.user, instance=request.user.profile)
    if not form.is_valid():
        return _json_error("Unable to update profile", status=400, errors=_form_errors(form))

    profile = form.save(commit=False)
    profile.user = request.user
    profile.user.first_name = data.get("first_name", request.user.first_name)
    profile.user.last_name = data.get("last_name", request.user.last_name)
    profile.user.save()
    profile.save()

    return JsonResponse(
        {
            "ok": True,
            "message": "Profile updated successfully",
            "data": {"profile": _serialize_profile(profile)},
        }
    )


@api_login_required
@require_GET
def public_profile_api(request, user_id):
    if not _is_instructor(request.user) and request.user.id != user_id:
        return _json_error("You do not have permission to view this profile", status=403)

    profile = get_object_or_404(Profile.objects.select_related("user"), user_id=user_id)
    workshops = Workshop.objects.filter(coordinator_id=user_id).order_by("date")
    return JsonResponse(
        {
            "ok": True,
            "data": {
                "profile": _serialize_profile(profile),
                "workshops": [_serialize_workshop(workshop) for workshop in workshops],
            },
        }
    )
