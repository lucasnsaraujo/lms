"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

export const AttachmentForm = ({
  courseId,
  initialData,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/attachments`, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      toggleEdit();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await fetch(
        `/api/courses/${courseId}/attachments/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      toast.success("Attachment deleted!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="mt-6 border bg-slate-100 rounded-md p-4">
        {/* Field */}
        <div className="font-medium flex items-center justify-between">
          Course attachments
          <Button variant="ghost" onClick={toggleEdit}>
            {isEditing && <>Cancel</>}
            {!isEditing && (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add a file
              </>
            )}
          </Button>
        </div>
        {/* Not editing */}
        {!isEditing && (
          <>
            {initialData.attachments.length === 0 && (
              <p className="text-sm mt-2 text-slate-500">No attachments yet</p>
            )}
            {initialData.attachments.length > 0 && (
              <div className="space-y-2 mt-3">
                {initialData.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                  >
                    <File />
                    <p className="ml-2 text-xs line-clamp-1">
                      {attachment.name}
                    </p>
                    {deletingId === attachment.id && (
                      <div className="ml-auto">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    )}
                    {deletingId !== attachment.id && (
                      <button
                        onClick={() => onDelete(attachment.id)}
                        className="ml-auto hover:opacity-75 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {/* Editing */}
        {isEditing && (
          <div>
            <FileUpload
              endpoint="courseAttachment"
              onChange={(url) => {
                if (url) {
                  onSubmit({ url });
                }
              }}
            />
            <div className="text-xs text-muted-foreground mt-4">
              Add anything your students might need to complete the course
            </div>
          </div>
        )}
      </div>
    </>
  );
};
