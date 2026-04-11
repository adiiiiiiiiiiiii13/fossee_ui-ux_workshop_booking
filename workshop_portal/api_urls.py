from django.urls import path

from statistics_app import api_views as statistics_api
from workshop_app import api_views as workshop_api


urlpatterns = [
    path("choices/", workshop_api.choices_api, name="api-choices"),
    path("auth/session/", workshop_api.session_api, name="api-session"),
    path("auth/login/", workshop_api.login_api, name="api-login"),
    path("auth/register/", workshop_api.register_api, name="api-register"),
    path("auth/logout/", workshop_api.logout_api, name="api-logout"),
    path("status/", workshop_api.status_api, name="api-status"),
    path("workshops/propose/", workshop_api.propose_workshop_api, name="api-propose-workshop"),
    path("workshops/<int:workshop_id>/", workshop_api.workshop_detail_api, name="api-workshop-detail"),
    path("workshops/<int:workshop_id>/comments/", workshop_api.workshop_comment_api, name="api-workshop-comment"),
    path("workshops/<int:workshop_id>/accept/", workshop_api.accept_workshop_api, name="api-workshop-accept"),
    path("workshops/<int:workshop_id>/reschedule/", workshop_api.reschedule_workshop_api, name="api-workshop-reschedule"),
    path("workshop-types/", workshop_api.workshop_types_api, name="api-workshop-types"),
    path("workshop-types/create/", workshop_api.workshop_type_create_api, name="api-workshop-type-create"),
    path("workshop-types/<int:workshop_type_id>/", workshop_api.workshop_type_detail_api, name="api-workshop-type-detail"),
    path("workshop-types/<int:workshop_type_id>/update/", workshop_api.workshop_type_update_api, name="api-workshop-type-update"),
    path(
        "workshop-types/<int:workshop_type_id>/attachments/<int:file_id>/delete/",
        workshop_api.attachment_delete_api,
        name="api-attachment-delete",
    ),
    path("workshop-types/<int:workshop_type_id>/tnc/", workshop_api.workshop_tnc_api, name="api-workshop-type-tnc"),
    path("profile/me/", workshop_api.own_profile_api, name="api-own-profile"),
    path("profile/me/update/", workshop_api.own_profile_update_api, name="api-own-profile-update"),
    path("profile/<int:user_id>/", workshop_api.public_profile_api, name="api-public-profile"),
    path("statistics/public/", statistics_api.public_stats_api, name="api-public-stats"),
    path("statistics/public/export/", statistics_api.public_stats_export_api, name="api-public-stats-export"),
    path("statistics/team/", statistics_api.team_stats_api, name="api-team-stats"),
    path("statistics/team/<int:team_id>/", statistics_api.team_stats_api, name="api-team-stats-detail"),
]
