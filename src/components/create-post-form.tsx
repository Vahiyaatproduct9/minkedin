'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from './providers/auth-provider';
import { suggestTitle as suggestTitleFlow } from '@/ai/flows/post';
import { useState, useTransition } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }).max(100, { message: 'Title must be 100 characters or less.' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters.' }),
});

export function CreatePostForm() {
  const { createPost } = useAuth();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const contentValue = form.watch('content');

  const handleGenerateTitle = async () => {
    const content = form.getValues('content');
    if (content.length < 10) {
      toast({
        variant: "destructive",
        title: 'Content too short',
        description: 'Please write at least 10 characters to generate a title.',
      });
      return;
    }

    startTransition(async () => {
      const { response, error } = await suggestTitleFlow(content);
      if (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: 'Error Generating Title',
            description: 'Could not generate a title. Please try again.',
        });
        return;
      }
      form.setValue('title', response.trim().replace(/"/g, ''));
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    createPost(values);
    form.reset();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts, reflections, or stories..."
                      className="min-h-[200px] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Title</FormLabel>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <FormControl>
                      <Input placeholder="Your post title" {...field} className="text-base" />
                    </FormControl>
                    <Button 
                      type="button" 
                      onClick={handleGenerateTitle} 
                      disabled={isPending || !contentValue}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                      )}
                      Generate Title
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" className="w-full">
              Publish Post
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
