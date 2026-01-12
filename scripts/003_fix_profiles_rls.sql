-- Drop the problematic admin policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Instead of checking profiles table (which causes recursion), 
-- we'll allow authenticated users to read their own profile and make a simple policy
-- Admins will be able to access via service role key or direct SQL

-- Keep the basic user policies that don't cause recursion
-- Users can already view their own profile with this policy:
-- "Users can view their own profile"

-- For the navbar to check admin status, we'll use a different approach
-- Create a security definer function that can check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin_user boolean;
BEGIN
  SELECT is_admin INTO is_admin_user
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN COALESCE(is_admin_user, false);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_user_admin(uuid) TO authenticated;
