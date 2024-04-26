"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1),
});

export const CategoryForm = ({
  courseId,
  initialData,
  options,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  );

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { categoryId: initialData.categoryId || "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
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

  return (
    <>
      <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
          Course category
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
          <p
            className={cn(
              "text-sm mt-2",
              !initialData.categoryId && "text-slate-500 italic"
            )}
          >
            {selectedOption?.label || "No category selected"}
          </p>
        )}
        {isEditing && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox options={options} {...field} />
                    </FormControl>
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
