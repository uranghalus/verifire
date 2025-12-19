import { UseFormReturn } from 'react-hook-form';
import slugify from 'slugify';
import { useRef } from 'react';
import { OrganizationForm } from '@/app/(main)/organizations/data/schema';

export function useAutoSlug(
  form: UseFormReturn<OrganizationForm>,
  disabled = false
) {
  const slugEditedRef = useRef(false);

  const onNameChange = (value: string) => {
    form.setValue('name', value, {
      shouldDirty: true,
    });

    if (disabled || slugEditedRef.current) return;

    const slug = slugify(value, {
      lower: true,
      strict: true,
      trim: true,
    });

    form.setValue('slug', slug, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSlugChange = (value: string) => {
    slugEditedRef.current = true;

    form.setValue('slug', value, {
      shouldDirty: true,
    });
  };

  const reset = () => {
    slugEditedRef.current = false;
  };

  return {
    onNameChange,
    onSlugChange,
    reset,
  };
}
