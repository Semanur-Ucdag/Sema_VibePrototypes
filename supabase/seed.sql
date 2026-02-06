-- Seed Dutch users for MentalCareGroup
-- Password for all test users: Test1234!

-- =====================
-- THERAPISTS
-- =====================

-- Dr. Sophie van den Berg - Clinical Psychologist
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '00000000-0000-0000-0000-000000000000',
  'sophie.vandenberg@mentalcare.nl',
  crypt('Test1234!', gen_salt('bf')),
  NOW(),
  '{"full_name": "Dr. Sophie van den Berg", "role": "therapist"}'::jsonb,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

-- Update profile with therapist details
UPDATE public.profiles SET
  phone = '+31 6 12345678',
  date_of_birth = '1978-03-15',
  address = 'Herengracht 123',
  city = 'Amsterdam',
  postal_code = '1015 BH',
  specialization = 'Klinische Psychologie, Angststoornissen',
  bio = 'Dr. Sophie van den Berg is een ervaren klinisch psycholoog met meer dan 15 jaar ervaring in het behandelen van angststoornissen en depressie.'
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Mark de Wit - Psychotherapist
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  '00000000-0000-0000-0000-000000000000',
  'mark.dewit@mentalcare.nl',
  crypt('Test1234!', gen_salt('bf')),
  NOW(),
  '{"full_name": "Mark de Wit", "role": "therapist"}'::jsonb,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

UPDATE public.profiles SET
  phone = '+31 6 23456789',
  date_of_birth = '1982-07-22',
  address = 'Coolsingel 45',
  city = 'Rotterdam',
  postal_code = '3011 AD',
  specialization = 'Cognitieve Gedragstherapie, Trauma',
  bio = 'Mark de Wit is gespecialiseerd in cognitieve gedragstherapie en heeft uitgebreide ervaring met traumaverwerking en PTSS.'
WHERE id = 'b2c3d4e5-f6a7-8901-bcde-f23456789012';

-- Dr. Emma Janssen - Psychiatrist
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  'c3d4e5f6-a7b8-9012-cdef-345678901234',
  '00000000-0000-0000-0000-000000000000',
  'emma.janssen@mentalcare.nl',
  crypt('Test1234!', gen_salt('bf')),
  NOW(),
  '{"full_name": "Dr. Emma Janssen", "role": "therapist"}'::jsonb,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

UPDATE public.profiles SET
  phone = '+31 6 34567890',
  date_of_birth = '1975-11-08',
  address = 'Oudegracht 78',
  city = 'Utrecht',
  postal_code = '3511 AR',
  specialization = 'Psychiatrie, Medicatie Management',
  bio = 'Dr. Emma Janssen is psychiater met expertise in het combineren van medicamenteuze behandeling met psychotherapie.'
WHERE id = 'c3d4e5f6-a7b8-9012-cdef-345678901234';

-- Lisa Bakker - GZ-Psychologist
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  'd4e5f6a7-b8c9-0123-def0-456789012345',
  '00000000-0000-0000-0000-000000000000',
  'lisa.bakker@mentalcare.nl',
  crypt('Test1234!', gen_salt('bf')),
  NOW(),
  '{"full_name": "Lisa Bakker", "role": "therapist"}'::jsonb,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

UPDATE public.profiles SET
  phone = '+31 6 45678901',
  date_of_birth = '1988-05-30',
  address = 'Grote Markt 12',
  city = 'Groningen',
  postal_code = '9711 LV',
  specialization = 'GZ-Psychologie, Burnout, Stress',
  bio = 'Lisa Bakker richt zich op werkgerelateerde stress en burnout preventie. Ze begeleidt professionals bij het vinden van balans.'
WHERE id = 'd4e5f6a7-b8c9-0123-def0-456789012345';

-- =====================
-- PATIENTS
-- =====================

-- Jan de Vries
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  'e5f6a7b8-c9d0-1234-ef01-567890123456',
  '00000000-0000-0000-0000-000000000000',
  'jan.devries@gmail.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(),
  '{"full_name": "Jan de Vries", "role": "patient"}'::jsonb,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

UPDATE public.profiles SET
  phone = '+31 6 56789012',
  date_of_birth = '1990-02-14',
  address = 'Kalverstraat 56',
  city = 'Amsterdam',
  postal_code = '1012 PE'
WHERE id = 'e5f6a7b8-c9d0-1234-ef01-567890123456';

-- Maria Smit
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  'f6a7b8c9-d0e1-2345-f012-678901234567',
  '00000000-0000-0000-0000-000000000000',
  'maria.smit@outlook.nl',
  crypt('Test1234!', gen_salt('bf')),
  NOW(),
  '{"full_name": "Maria Smit", "role": "patient"}'::jsonb,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

UPDATE public.profiles SET
  phone = '+31 6 67890123',
  date_of_birth = '1985-09-03',
  address = 'Lijnbaan 89',
  city = 'Rotterdam',
  postal_code = '3012 EN'
WHERE id = 'f6a7b8c9-d0e1-2345-f012-678901234567';

-- Peter van Dijk
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  '07a8b9c0-d1e2-3456-0123-789012345678',
  '00000000-0000-0000-0000-000000000000',
  'peter.vandijk@hotmail.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(),
  '{"full_name": "Peter van Dijk", "role": "patient"}'::jsonb,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

UPDATE public.profiles SET
  phone = '+31 6 78901234',
  date_of_birth = '1995-12-20',
  address = 'Vredenburg 34',
  city = 'Utrecht',
  postal_code = '3511 BD'
WHERE id = '07a8b9c0-d1e2-3456-0123-789012345678';

-- Anna Mulder
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  '18b9c0d1-e2f3-4567-1234-890123456789',
  '00000000-0000-0000-0000-000000000000',
  'anna.mulder@gmail.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(),
  '{"full_name": "Anna Mulder", "role": "patient"}'::jsonb,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

UPDATE public.profiles SET
  phone = '+31 6 89012345',
  date_of_birth = '1992-06-18',
  address = 'Marktstraat 67',
  city = 'Den Haag',
  postal_code = '2511 BK'
WHERE id = '18b9c0d1-e2f3-4567-1234-890123456789';

-- Thomas Visser
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  '29c0d1e2-f3a4-5678-2345-901234567890',
  '00000000-0000-0000-0000-000000000000',
  'thomas.visser@ziggo.nl',
  crypt('Test1234!', gen_salt('bf')),
  NOW(),
  '{"full_name": "Thomas Visser", "role": "patient"}'::jsonb,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

UPDATE public.profiles SET
  phone = '+31 6 90123456',
  date_of_birth = '1988-01-25',
  address = 'Herestraat 23',
  city = 'Groningen',
  postal_code = '9711 LB'
WHERE id = '29c0d1e2-f3a4-5678-2345-901234567890';

-- Eva Hendriks
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  '3ad1e2f3-a4b5-6789-3456-012345678901',
  '00000000-0000-0000-0000-000000000000',
  'eva.hendriks@live.nl',
  crypt('Test1234!', gen_salt('bf')),
  NOW(),
  '{"full_name": "Eva Hendriks", "role": "patient"}'::jsonb,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

UPDATE public.profiles SET
  phone = '+31 6 01234567',
  date_of_birth = '1998-04-12',
  address = 'Stratumseind 45',
  city = 'Eindhoven',
  postal_code = '5611 EN'
WHERE id = '3ad1e2f3-a4b5-6789-3456-012345678901';

-- Willem Bos
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  '4be2f3a4-b5c6-7890-4567-123456789012',
  '00000000-0000-0000-0000-000000000000',
  'willem.bos@kpnmail.nl',
  crypt('Test1234!', gen_salt('bf')),
  NOW(),
  '{"full_name": "Willem Bos", "role": "patient"}'::jsonb,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

UPDATE public.profiles SET
  phone = '+31 6 11223344',
  date_of_birth = '1979-08-07',
  address = 'Binnenrotte 78',
  city = 'Rotterdam',
  postal_code = '3011 HC'
WHERE id = '4be2f3a4-b5c6-7890-4567-123456789012';

-- Saskia Kok
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  '5cf3a4b5-c6d7-8901-5678-234567890123',
  '00000000-0000-0000-0000-000000000000',
  'saskia.kok@gmail.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(),
  '{"full_name": "Saskia Kok", "role": "patient"}'::jsonb,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

UPDATE public.profiles SET
  phone = '+31 6 22334455',
  date_of_birth = '1993-11-30',
  address = 'Westerstraat 12',
  city = 'Amsterdam',
  postal_code = '1015 MK'
WHERE id = '5cf3a4b5-c6d7-8901-5678-234567890123';

-- Create identities for all users (required for auth to work properly)
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
SELECT 
  id,
  id,
  jsonb_build_object('sub', id::text, 'email', email),
  'email',
  id::text,
  NOW(),
  NOW(),
  NOW()
FROM auth.users;
