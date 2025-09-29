-- Add email_verified column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;