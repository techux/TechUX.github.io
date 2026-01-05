import React, { useState } from "react";
import * as ReactIcons from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";

const Contact = ({ data }) => {
  const [status, setStatus] = useState("idle");
  const [showMessage, setShowMessage] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const showForm = data.config?.showContactForm;

  const handleFieldChange = (field) => (e) => {
    if (e.target.value.trim()) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const errors = {};

    if (!form.name.value.trim()) errors.name = "Name is required";
    if (!form.email.value.trim()) errors.email = "Email is required";
    if (!form.subject.value.trim()) errors.subject = "Subject is required";
    if (!form.message.value.trim()) errors.message = "Message is required";

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setStatus("sending");
    const formData = new FormData(form);
    formData.append("access_key", "77a25902-8bed-4e59-b8b9-62c71061ef4e");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        setStatus("success");
        toast.success("Message Sent Successfully");
        form.reset();
      } else {
        throw new Error();
      }
    } catch {
      setStatus("error");
      toast.error("Something went wrong! Please try again.");
    }

    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 4000);
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section id="contact" className="py-10 overflow-x-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-5 md:mb-14">
          Get In <span className="text-primary">Touch</span>
        </h2>

        <div
          className={`grid gap-10 ${
            showForm ? "md:grid-cols-2" : "max-w-3xl mx-auto"
          }`}
        >
          <div className="bg-background/80 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-md">
            <h3 className="text-2xl font-bold mb-6 text-center md:text-left">
              Contact Information
            </h3>

            <div className="space-y-5 mb-8">
              {data.contactInfo.map((info, index) => {
                const Icon = ReactIcons[info.icon];
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-11 h-11 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                      <Icon className="text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold">{info.type}</p>
                      <p className="text-muted-foreground text-sm">
                        {info.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {data.socialLinks.map((social, index) => {
                const Icon = ReactIcons[social.icon];
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-11 h-11 flex items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          {showForm && (
            <div className="bg-background/80 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-md">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Send Me a Message
              </h3>

              {status !== "idle" && (
                <p
                  className={`mb-4 text-center font-medium transition-opacity ${
                    showMessage ? "opacity-100" : "opacity-0"
                  } ${
                    status === "success" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {status === "success"
                    ? "Message Sent Successfully"
                    : "Something went wrong! Please try again."}
                </p>
              )}

              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField
                    label="Name"
                    name="name"
                    error={fieldErrors.name}
                    onChange={handleFieldChange("name")}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    error={fieldErrors.email}
                    onChange={handleFieldChange("email")}
                  />
                </div>

                <InputField
                  label="Subject"
                  name="subject"
                  error={fieldErrors.subject}
                  onChange={handleFieldChange("subject")}
                />

                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    name="message"
                    rows={5}
                    placeholder="Your Message"
                    onChange={handleFieldChange("message")}
                  />
                  {fieldErrors.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full"
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </section>
  );
};

const InputField = ({ label, name, type = "text", error, onChange }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <Input name={name} type={type} onChange={onChange} />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default Contact;
