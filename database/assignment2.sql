-- 1. insert new record to the account table
INSERT INTO public.account
    (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')

-- 2. modify the Tony Stark record by changing the 
-- account_type to "Admin"
UPDATE public.account
SET account_type = 'Admin'
WHERE account_lastname = 'Stark';

-- 3. Delete Tony Stark from account
DELETE FROM public.account
WHERE account_lastname = 'Stark';

-- 4. Modify the "GM Hummer" record to read 
-- "a huge interior" rather than "small interiors" using a single query.
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

-- 5. Use an inner join
SELECT public.inventory.inv_model, public.inventory.inv_make, public.classification.classification_id
FROM public.inventory
INNER JOIN public.classification
ON public.inventory.classification_id = public.classification.classification_id
WHERE classification_name = 'Sport';

-- 6. Update all records
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

