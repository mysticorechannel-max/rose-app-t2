"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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

import {
  profileSchema,
  type ProfileFields,
} from "../lib/schemes/profile.schema";
import { AvatarUpload } from "./avatar-upload";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { useGetProfileQuery } from "../lib/apis/mutations/use-get-profile";

export function ProfileForm() {
  // Translation
  const t = useTranslations("account");
  const tSelect = useTranslations("select");

  // Queries
  const { data: user, isPending, error } = useGetProfileQuery();

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
    values: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone ?? "",
        }
      : undefined,
    resetOptions: { keepDirtyValues: true },
  });

  // Functions
  function errorText(message?: string): string | undefined {
    return message ? t(`validation.${message}`) : undefined;
  }

  function onSubmit(values: ProfileFields): void {
    // TODO: PATCH /api/users/profile
    console.log(values);
  }

  function handleDeleteAccount(): void {
    // TODO: DELETE /api/users/account
    console.log("Account deleted");
  }

  if (isPending) {
    return (
      <p role="status" className="text-sm text-text-soft">
        {t("loading")}
      </p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="text-sm text-text-danger">
        {error.message}
      </p>
    );
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

      {/* Read-only: the PATCH endpoint does not accept email */}
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
        <DeleteAccountDialog onConfirm={handleDeleteAccount} />
        <Button type="submit" className="min-w-52">
          {t("profile.save")}
        </Button>
      </div>
    </form>
  );
}