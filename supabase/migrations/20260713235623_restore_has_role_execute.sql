-- Restore EXECUTE on has_role() for the authenticated role.
-- 20260702015637 revoked it based on the incorrect assumption that SECURITY DEFINER
-- exempts a function from the caller's EXECUTE privilege check. It does not: SECURITY DEFINER
-- only elevates privileges for actions taken inside the function body (e.g. reading
-- user_roles); Postgres still requires the calling role to hold EXECUTE to invoke the
-- function at all. Since has_role() is called directly inside RLS policies (USING/WITH CHECK)
-- on every admin-managed table, revoking it from authenticated made every admin write fail
-- with "permission denied for function has_role", including for real admins.
-- anon stays revoked: anonymous requests never need to evaluate an admin-only policy.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
