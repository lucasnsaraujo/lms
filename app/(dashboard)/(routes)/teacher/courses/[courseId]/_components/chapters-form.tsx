"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { ChaptersList } from "./chapters-list";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const ChaptersForm = ({ courseId, initialData }: ChaptersFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const toggleCreating = () => setIsCreating((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/chapters`, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      toast.success("Chapter created 🎉");
      toggleCreating();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      const response = await fetch(
        `/api/courses/${courseId}/chapters/reorder`,
        {
          method: "PUT",
          body: JSON.stringify({ list: updateData }),
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      toast.success("Chapters reordered! 🎉");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <>
      <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
        {isUpdating && (
          <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
            <Loader2 className="animate-spin w-6 h-6 text-sky-700" />
          </div>
        )}
        <div className="font-medium flex items-center justify-between">
          Course chapters
          <Button variant="ghost" onClick={toggleCreating}>
            {isCreating && <>Cancel</>}
            {!isCreating && (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add a chapter
              </>
            )}
          </Button>
        </div>
        {isCreating && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'Introduction to web development'"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button disabled={!isValid || isSubmitting} type="submit">
                  {isSubmitting && (
                    <div className="border-t-transparent border-solid animate-spin rounded-full border-slate-400 border-2 h-3 w-3 mr-3" />
                  )}
                  Create
                </Button>
              </div>
            </form>
          </Form>
        )}
        {!isCreating && (
          <div
            className={cn(
              "text-sm mt-2",
              !initialData.chapters.length && "text-slate-500 italic"
            )}
          >
            {!initialData.chapters.length && "No chapters yet"}
            <ChaptersList
              onEdit={onEdit}
              onReorder={onReorder}
              items={initialData.chapters || []}
            />
          </div>
        )}
        {!isCreating && (
          <p className="text-xs text-muted-foreground mt-4">
            Drag and drop to reorder the chapters
          </p>
        )}
      </div>
    </>
  );
};
