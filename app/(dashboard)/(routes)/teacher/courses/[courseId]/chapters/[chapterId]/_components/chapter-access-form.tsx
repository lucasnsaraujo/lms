"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Checkbox } from "@/components/ui/checkbox";

interface ChapterAccessFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

export const ChapterAccessForm = ({
  courseId,
  initialData,
  chapterId,
}: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { isFree: !!initialData.isFree },
  });

  const { isSubmitting, isValid } = form.formState;

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        {
          method: "PATCH",
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      toggleEdit();
      toast.success("Chapter updated! 🎉");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
          Chapter access
          <Button variant="ghost" onClick={toggleEdit}>
            {isEditing && <>Cancel</>}
            {!isEditing && (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>
        {!isEditing && (
          <div
            className={cn(
              "text-sm mt-2",
              !initialData.isFree && "text-slate-500 italic"
            )}
          >
            {initialData.isFree ? (
              <>This chapter is free for preview</>
            ) : (
              <>This chapter is not free</>
            )}
          </div>
        )}
        {isEditing && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormDescription>
                        Check this box if you want to make this chapter free for
                        preview
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button disabled={!isValid || isSubmitting} type="submit">
                  {isSubmitting && (
                    <div className="border-t-transparent border-solid animate-spin rounded-full border-slate-400 border-2 h-3 w-3 mr-3" />
                  )}
                  Save
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </>
  );
};
