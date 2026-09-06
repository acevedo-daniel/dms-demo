"use client";

import { useId, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, AlertTriangle, Check, UserPlus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { announceWorkspaceFeedback } from "@/components/workspace-feedback";
import { useI18n } from "@/lib/i18n";

export type EditablePatient = {
  email: string | null;
  firstName: string;
  id: string;
  identifier: string;
  lastName: string;
  phone: string | null;
};

type PatientFormPanelProps = {
  defaultOpen?: boolean;
  onSaved?: (patient: EditablePatient) => void;
  patient?: EditablePatient;
  trigger: ReactNode;
};

type PatientFormState = {
  email: string;
  firstName: string;
  identifier: string;
  lastName: string;
  phone: string;
};

function toFormState(patient?: EditablePatient): PatientFormState {
  return {
    email: patient?.email ?? "",
    firstName: patient?.firstName ?? "",
    identifier: patient?.identifier ?? "",
    lastName: patient?.lastName ?? "",
    phone: patient?.phone ?? "",
  };
}

function getServerMessage(payload: unknown, fallback: string) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "object" &&
    payload.error !== null &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }

  return fallback;
}

export function PatientFormPanel({
  defaultOpen = false,
  onSaved,
  patient,
  trigger,
}: PatientFormPanelProps) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const formId = useId();
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState(() => toFormState(patient));
  const [initialValues, setInitialValues] = useState(() =>
    toFormState(patient),
  );
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    firstName?: string;
    identifier?: string;
    lastName?: string;
  }>({});
  const isEditing = Boolean(patient);
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);
  const identifierError =
    fieldErrors.identifier ||
    (error?.toLowerCase().includes("identifier") ||
    error?.toLowerCase().includes("identificador")
      ? error
      : null);
  const firstNameError =
    fieldErrors.firstName ||
    (error?.toLowerCase().includes("first name") ||
    error?.toLowerCase().includes("nombre")
      ? error
      : null);
  const lastNameError =
    fieldErrors.lastName ||
    (error?.toLowerCase().includes("last name") ||
    error?.toLowerCase().includes("apellido")
      ? error
      : null);
  const emailError = fieldErrors.email || null;

  function requestClose() {
    if (isPending) {
      return;
    }

    if (isDirty) {
      setIsDiscardOpen(true);
      return;
    }

    setIsOpen(false);
  }

  function updateValue(field: keyof PatientFormState, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function savePatient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFieldErrors: {
      email?: string;
      firstName?: string;
      identifier?: string;
      lastName?: string;
    } = {};

    if (!values.identifier.trim()) {
      nextFieldErrors.identifier =
        locale === "es"
          ? "El identificador es obligatorio (ej. PAT-010)."
          : "Identifier is required (e.g. PAT-010).";
    }

    if (!values.firstName.trim()) {
      nextFieldErrors.firstName =
        locale === "es"
          ? "El nombre es obligatorio."
          : "First name is required.";
    }

    if (!values.lastName.trim()) {
      nextFieldErrors.lastName =
        locale === "es"
          ? "El apellido es obligatorio."
          : "Last name is required.";
    }

    if (
      values.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
    ) {
      nextFieldErrors.email =
        locale === "es"
          ? "Ingresá un correo electrónico válido (ej. nombre@dominio.com)."
          : "Enter a valid email address (e.g. name@domain.com).";
    }

    if (Object.values(nextFieldErrors).some(Boolean)) {
      setFieldErrors(nextFieldErrors);
      setError(
        nextFieldErrors.identifier ||
          nextFieldErrors.firstName ||
          nextFieldErrors.lastName ||
          nextFieldErrors.email ||
          (locale === "es"
            ? "Por favor completá todos los campos obligatorios."
            : "Please fill out all required fields."),
      );
      return;
    }

    setFieldErrors({});
    setError(null);
    setIsPending(true);

    try {
      const response = await fetch(
        patient ? `/api/demo/patients/${patient.id}` : "/api/demo/patients",
        {
          body: JSON.stringify(values),
          headers: { "Content-Type": "application/json" },
          method: patient ? "PATCH" : "POST",
        },
      );
      const payload = (await response.json()) as EditablePatient;

      if (!response.ok) {
        throw new Error(
          getServerMessage(
            payload,
            locale === "es"
              ? "No se pudo guardar la ficha del paciente."
              : "Could not save patient record.",
          ),
        );
      }

      const savedValues = toFormState(payload);
      setInitialValues(savedValues);
      setValues(savedValues);
      setIsOpen(false);
      onSaved?.(payload);
      announceWorkspaceFeedback(
        isEditing
          ? t.patients.form.feedbackUpdated
          : t.patients.form.feedbackCreated,
      );
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : locale === "es"
            ? "No se pudo guardar la ficha del paciente."
            : "Could not save patient record.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <Dialog
        onOpenChange={(open) => {
          if (open) {
            setError(null);
            setFieldErrors({});
            setValues(initialValues);
            setIsOpen(true);
            return;
          }

          requestClose();
        }}
        open={isOpen}
      >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className="top-0 right-0 left-auto h-dvh w-full max-w-none translate-x-0 translate-y-0 rounded-none border-y-0 border-r-0 border-l border-border/80 bg-card/95 p-0 backdrop-blur-md shadow-dialog duration-[var(--motion-base)] sm:w-[32rem] sm:max-w-none"
          onEscapeKeyDown={(event) => {
            if (isDirty) {
              event.preventDefault();
              setIsDiscardOpen(true);
            }
          }}
          onPointerDownOutside={(event) => {
            if (isDirty) {
              event.preventDefault();
              setIsDiscardOpen(true);
            }
          }}
        >
          <DialogHeader className="border-b border-border/80 bg-secondary/15 px-6 py-5 text-left">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {locale === "es" ? "Ficha de paciente" : "Patient file"}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span>Atelier Dental</span>
            </div>
            <DialogTitle className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">
              {isEditing ? t.patients.form.titleEdit : t.patients.form.titleNew}
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {isEditing ? t.patients.form.descEdit : t.patients.form.descNew}
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex min-h-0 flex-1 flex-col"
            id={formId}
            noValidate
            onSubmit={savePatient}
          >
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {/* Clinical Identity Section */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {locale === "es" ? "Identidad clínica" : "Clinical identity"}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      className="text-xs font-semibold text-foreground"
                      htmlFor={`${formId}-identifier`}
                    >
                      {locale === "es" ? "Identificador" : "Identifier"}
                    </Label>
                    {identifierError ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive animate-in fade-in-0 duration-150">
                        <AlertCircle aria-hidden className="size-3 shrink-0" />
                        {locale === "es" ? "Obligatorio" : "Required"}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {locale === "es"
                          ? "N° de ficha único"
                          : "Unique record ID"}
                      </span>
                    )}
                  </div>
                  <Input
                    aria-describedby={
                      identifierError ? `${formId}-identifier-error` : undefined
                    }
                    aria-invalid={Boolean(identifierError)}
                    autoComplete="off"
                    autoFocus
                    className="font-mono text-sm tracking-wide placeholder:font-sans"
                    id={`${formId}-identifier`}
                    onChange={(event) =>
                      updateValue("identifier", event.target.value)
                    }
                    placeholder={
                      locale === "es" ? "ej. PAT-010" : "e.g. PAT-010"
                    }
                    required
                    value={values.identifier}
                  />
                  {identifierError ? (
                    <p
                      className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in-0 slide-in-from-top-0.5"
                      id={`${formId}-identifier-error`}
                      role="alert"
                    >
                      <AlertCircle aria-hidden className="size-3.5 shrink-0" />
                      {identifierError}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        className="text-xs font-semibold text-foreground"
                        htmlFor={`${formId}-first-name`}
                      >
                        {locale === "es" ? "Nombre" : "First name"}
                      </Label>
                      {firstNameError ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive animate-in fade-in-0 duration-150">
                          <AlertCircle
                            aria-hidden
                            className="size-3 shrink-0"
                          />
                          {locale === "es" ? "Obligatorio" : "Required"}
                        </span>
                      ) : null}
                    </div>
                    <Input
                      aria-describedby={
                        firstNameError
                          ? `${formId}-first-name-error`
                          : undefined
                      }
                      aria-invalid={Boolean(firstNameError)}
                      id={`${formId}-first-name`}
                      onChange={(event) =>
                        updateValue("firstName", event.target.value)
                      }
                      placeholder={locale === "es" ? "ej. Elena" : "e.g. Elena"}
                      required
                      value={values.firstName}
                    />
                    {firstNameError ? (
                      <p
                        className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in-0 slide-in-from-top-0.5"
                        id={`${formId}-first-name-error`}
                        role="alert"
                      >
                        <AlertCircle
                          aria-hidden
                          className="size-3.5 shrink-0"
                        />
                        {firstNameError}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        className="text-xs font-semibold text-foreground"
                        htmlFor={`${formId}-last-name`}
                      >
                        {locale === "es" ? "Apellido" : "Last name"}
                      </Label>
                      {lastNameError ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive animate-in fade-in-0 duration-150">
                          <AlertCircle
                            aria-hidden
                            className="size-3 shrink-0"
                          />
                          {locale === "es" ? "Obligatorio" : "Required"}
                        </span>
                      ) : null}
                    </div>
                    <Input
                      aria-describedby={
                        lastNameError ? `${formId}-last-name-error` : undefined
                      }
                      aria-invalid={Boolean(lastNameError)}
                      id={`${formId}-last-name`}
                      onChange={(event) =>
                        updateValue("lastName", event.target.value)
                      }
                      placeholder={
                        locale === "es" ? "ej. Rostova" : "e.g. Rostova"
                      }
                      required
                      value={values.lastName}
                    />
                    {lastNameError ? (
                      <p
                        className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in-0 slide-in-from-top-0.5"
                        id={`${formId}-last-name-error`}
                        role="alert"
                      >
                        <AlertCircle
                          aria-hidden
                          className="size-3.5 shrink-0"
                        />
                        {lastNameError}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4 border-t border-border/80 pt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {locale === "es" ? "Datos de contacto" : "Contact details"}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      className="text-xs font-semibold text-foreground"
                      htmlFor={`${formId}-email`}
                    >
                      {t.patients.form.email}
                    </Label>
                    {emailError ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive animate-in fade-in-0 duration-150">
                        <AlertCircle aria-hidden className="size-3 shrink-0" />
                        {locale === "es"
                          ? "Formato inválido"
                          : "Invalid format"}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {locale === "es" ? "Opcional" : "Optional"}
                      </span>
                    )}
                  </div>
                  <Input
                    aria-describedby={
                      emailError ? `${formId}-email-error` : undefined
                    }
                    aria-invalid={Boolean(emailError)}
                    id={`${formId}-email`}
                    onChange={(event) =>
                      updateValue("email", event.target.value)
                    }
                    placeholder={
                      locale === "es"
                        ? "paciente@ejemplo.com"
                        : "patient@example.com"
                    }
                    type="email"
                    value={values.email}
                  />
                  {emailError ? (
                    <p
                      className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in-0 slide-in-from-top-0.5"
                      id={`${formId}-email-error`}
                      role="alert"
                    >
                      <AlertCircle aria-hidden className="size-3.5 shrink-0" />
                      {emailError}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label
                    className="text-xs font-semibold text-foreground"
                    htmlFor={`${formId}-phone`}
                  >
                    {t.patients.form.phone}
                  </Label>
                  <Input
                    id={`${formId}-phone`}
                    onChange={(event) =>
                      updateValue("phone", event.target.value)
                    }
                    placeholder="(11) 4123-4567"
                    type="tel"
                    value={values.phone}
                  />
                </div>
              </div>

              {error &&
              !identifierError &&
              !firstNameError &&
              !lastNameError &&
              !emailError ? (
                <div
                  className="flex items-center gap-2 rounded-[var(--radius-md)] border border-destructive/30 bg-destructive/10 p-3.5 text-xs font-medium text-destructive"
                  role="alert"
                >
                  <AlertCircle aria-hidden className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}
            </div>

            <DialogFooter className="mt-auto border-t border-border/80 bg-secondary/15 px-6 py-4 sm:justify-between">
              <Button onClick={requestClose} type="button" variant="ghost">
                {locale === "es" ? "Cerrar" : "Close"}
              </Button>
              <Button disabled={isPending} type="submit">
                {isEditing ? (
                  <Check aria-hidden className="size-4" />
                ) : (
                  <UserPlus aria-hidden className="size-4" />
                )}
                {isPending
                  ? isEditing
                    ? t.patients.form.saving
                    : locale === "es"
                      ? "Agregando…"
                      : "Adding…"
                  : isEditing
                    ? t.patients.form.saveEdit
                    : t.patients.form.saveNew}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog onOpenChange={setIsDiscardOpen} open={isDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-secondary/80 text-foreground/80">
                <AlertTriangle
                  aria-hidden
                  className="size-4 text-foreground/80"
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {locale === "es" ? "Cambios sin guardar" : "Unsaved changes"}
              </span>
            </div>
            <AlertDialogTitle>
              {locale === "es" ? "¿Descartar cambios?" : "Discard changes?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {locale === "es"
                ? "Se perderán las modificaciones no guardadas en esta ficha."
                : "Unsaved modifications to this record will be lost."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel autoFocus>
              {locale === "es" ? "Continuar editando" : "Continue editing"}
            </AlertDialogCancel>
            <AlertDialogAction
              className="dms-pressable rounded-full border border-destructive/20 bg-destructive px-4 text-xs font-semibold text-destructive-foreground shadow-xs transition-all hover:bg-destructive/90 active:scale-[0.98]"
              onClick={() => {
                setIsDiscardOpen(false);
                setIsOpen(false);
              }}
            >
              <AlertTriangle aria-hidden className="size-3.5" />
              {locale === "es" ? "Descartar cambios" : "Discard changes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
