"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import { useDeleteAccountMutation } from "../lib/apis/mutations/use-delete-account";
import { useUpdateProfileMutation } from "../lib/apis/mutations/use-update-profile";
import {
  profileSchema,
  type ProfileFields,
} from "../lib/schemes/profile.schema";
import type { UserProfile } from "../lib/types/account";
import { AvatarUpload } from "./avatar-upload";
import { DeleteAccountDialog } from "./delete-account-dialog";

type ProfileFormProps = {
  user: UserProfile;
};

export function ProfileForm({ user }: ProfileFormProps) {
  // Translation
  const t = useTranslations("account");
  const tSelect = useTranslations("select");

  const locale = useLocale();

  // Mutation
  const { mutate: updateProfile, isPending: isSaving } =
    useUpdateProfileMutation();
  const { mutate: deleteAccount, isPending: isDeleting } =
    useDeleteAccountMutation();

  // Form & validation
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
    values: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? "",
    },
    resetOptions: { keepDirtyValues: true },
  });

  // Functions
  function errorText(message?: string): string | undefined {
    return message ? t(`validation.${message}`) : undefined;
  }

  function onSubmit(values: ProfileFields): void {
    updateProfile({
      firstName: values.firstName,
      lastName: values.lastName,
      ...(values.phone ? { phone: values.phone } : {}),
    });
  }

  function handleDeleteAccount(closeDialog: () => void): void {
    deleteAccount(undefined, {
      onSuccess: () => {
        closeDialog();
        signOut({ callbackUrl: `/${locale}` });
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <AvatarUpload />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t("profile.firstName")}
          error={errorText(errors.firstName?.message)}
          {...register("firstName")}
        />
        <Input
          label={t("profile.lastName")}
          error={errorText(errors.lastName?.message)}
          {...register("lastName")}
        />
      </div>

      <Input label={t("profile.email")} value={user.email} readOnly disabled />

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <Input
            type="phone"
            label={t("profile.phone")}
            defaultCountry="EG"
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            error={errorText(errors.phone?.message)}
          />
        )}
      />

      {/* Read-only: the PATCH endpoint does not accept gender */}
      <div className="space-y-2">
        <Label htmlFor="gender">{t("profile.gender")}</Label>
        <Select value={user.gender} disabled>
          <SelectTrigger id="gender">
            <SelectValue placeholder={tSelect("placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">{t("profile.genders.male")}</SelectItem>
            <SelectItem value="FEMALE">{t("profile.genders.female")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between pt-6">
        <DeleteAccountDialog
          isPending={isDeleting}
          onConfirm={handleDeleteAccount}
        />
        <Button type="submit" loading={isSaving} className="min-w-52">
          {t("profile.save")}
        </Button>
      </div>
    </form>
  );
}