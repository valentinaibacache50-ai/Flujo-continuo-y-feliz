-- Revoke EXECUTE on has_role from anon/authenticated. The function is used inside RLS policies (SECURITY DEFINER runs with owner privileges regardless of caller EXECUTE rights). The client no longer calls it directly.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, PUBLIC;

-- Keep increment_programa_view executable by authenticated (called from client to track program views), but revoke from anon.
REVOKE EXECUTE ON FUNCTION public.increment_programa_view(uuid, text) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_programa_view(uuid, text) TO authenticated;

-- Internal trigger function should not be callable by API roles.
REVOKE EXECUTE ON FUNCTION public.validate_programa_video_url() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;