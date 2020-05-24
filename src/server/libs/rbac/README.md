# RBAC

## RBAC design

RBAC should define roles and permissions for entities on our platform.
Permissions should be formed in the shape of `entity-name:permission` where
permission and entity-name are both in exclusive enums in the DB.


Permissions(Enum) -
unauthorized
read
write
manage

Roles(Enum) -
Observer
User
Admin
GlobalAdmin

this should be more like (Observer - documents:read, documents:write, etc)
MapRolePermission -
Observer - read
User - read, write
Admin - read, write, manage
GlobalAdmin - read, write, manage

MapUserRole -
User1 - Observer
User2 - Admin
