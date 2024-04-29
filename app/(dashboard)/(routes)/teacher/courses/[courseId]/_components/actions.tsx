"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const Actions = ({ courseId, disabled, isPublished }: ActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        const response = await fetch(`/api/courses/${courseId}/unpublish`, {
          method: "PATCH",
        });

        if (!response.ok) throw new Error("Something went wrong");

        toast.success("Chapter unpublished!");
        router.push(`/teacher/courses/`);
      } else {
        const response = await fetch(`/api/courses/${courseId}/publish`, {
          method: "PATCH",
        });

        if (!response.ok) throw new Error("Something went wrong");

        toast.success("Chapter published!");
      }

      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      toast.success("Chapter deleted!");
      router.push(`/teacher/courses/${courseId}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
