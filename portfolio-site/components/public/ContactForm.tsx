"use client";

/**
 * components/public/ContactForm.tsx
 * Animated contact form with validation, submission, and toast feedback.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must be under 2000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const messageLength = watch("message")?.length || 0;

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send");

      setSent(true);
      reset();
      toast.success("Message sent! I'll get back to you soon.");
      setTimeout(() => setSent(false), 5000);
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-glass p-10 flex flex-col items-center gap-4 text-center"
      >
        <div className="p-4 rounded-full bg-emerald-500/10">
          <CheckCircle size={40} className="text-emerald-400" />
        </div>
        <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
          Message Sent!
        </h3>
        <p className="text-[var(--text-muted)]">
          Thank you for reaching out. I&apos;ll respond to your message as soon
          as possible.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-glass p-6 md:p-8 space-y-5"
      noValidate
    >
      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-[var(--text-secondary)]"
          >
            Your Name <span className="text-red-400">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="John Smith"
            {...register("name")}
            className={cn(
              "form-input",
              errors.name && "border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
            )}
          />
          {errors.name && (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-[var(--text-secondary)]"
          >
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
            className={cn(
              "form-input",
              errors.email && "border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
            )}
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <label
          htmlFor="contact-subject"
          className="block text-sm font-medium text-[var(--text-secondary)]"
        >
          Subject <span className="text-red-400">*</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          placeholder="What's this about?"
          {...register("subject")}
          className={cn(
            "form-input",
            errors.subject && "border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
          )}
        />
        {errors.subject && (
          <p className="text-xs text-red-400">{errors.subject.message}</p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-[var(--text-secondary)]"
          >
            Message <span className="text-red-400">*</span>
          </label>
          <span
            className={cn(
              "text-xs",
              messageLength > 1800
                ? "text-red-400"
                : "text-[var(--text-muted)]"
            )}
          >
            {messageLength}/2000
          </span>
        </div>
        <textarea
          id="contact-message"
          rows={6}
          placeholder="Tell me about your project, question, or opportunity..."
          {...register("message")}
          className={cn(
            "form-input resize-none",
            errors.message && "border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
          )}
        />
        {errors.message && (
          <p className="text-xs text-red-400">{errors.message.message}</p>
        )}
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
        className={cn(
          "w-full flex items-center justify-center gap-2",
          "px-6 py-3.5 rounded-xl text-sm font-semibold text-white",
          "bg-gradient-to-r from-indigo-600 to-violet-600",
          "hover:from-indigo-500 hover:to-violet-500",
          "shadow-lg hover:shadow-indigo-500/30",
          "transition-shadow duration-200",
          isSubmitting && "opacity-70 cursor-not-allowed"
        )}
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={16} />
            Send Message
          </>
        )}
      </motion.button>
    </form>
  );
}
