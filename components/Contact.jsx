import React, { useState } from "react";
import * as ReactIcons from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";

const Contact = ({ data }) => {
  const [status, setStatus] = useState("idle");
  // idle | sending | success | error
  const [showMessage, setShowMessage] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

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

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    setStatus("sending");

    const formData = new FormData(event.target);
    formData.append("access_key", "77a25902-8bed-4e59-b8b9-62c71061ef4e");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setFieldErrors({});
        setShowMessage(true);
        toast.success("Message Sent Successfully");
        event.target.reset();
      } else {
        setStatus("error");
        setShowMessage(true);
        toast.error("Something went wrong! Please try again.");
      }
    } catch {
      setStatus("error");
      toast.error("Something went wrong! Please try again.");
    }

    setTimeout(() => {
      setShowMessage(false);
    }, 5000);

    setTimeout(() => {
      setStatus("idle");
    }, 6000);
  };

  return (
    <section id="contact" className="py-20 overflow-x-hidden">
      <div className="container mx-auto px-4">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-16"
          data-aos="fade-up"
        >
          Get In <span className="text-primary">Touch</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div data-aos="fade-right">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-4 mb-8">
              {data.contactInfo.map((info, index) => {
                const IconComponent = ReactIcons[info.icon];
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                      <span className="text-xl">
                        <IconComponent />
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{info.type}</h4>
                      <p className="text-muted-foreground">{info.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex space-x-4">
              {data.socialLinks.map((social, index) => {
                const IconComponent = ReactIcons[social.icon];
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-background border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                    aria-label={social.name}
                    title={social.name}
                  >
                    <span className="text-lg">
                      <IconComponent />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
          <div data-aos="fade-left" className="flex justify-center">
            <div className="w-full max-w-lg bg-background/80 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Send Me a Message
              </h3>

              {status === "success" && (
                <div
                  className={`mb-4 text-center font-medium text-green-500 transition-opacity duration-500 ${
                    showMessage ? "opacity-100" : "opacity-0"
                  }`}
                  data-aos="fade-in"
                >
                  Message Sent Successfully
                </div>
              )}

              {status === "error" && (
                <div
                  className={`mb-4 text-center font-medium text-red-500 transition-opacity duration-500 ${
                    showMessage ? "opacity-100" : "opacity-0"
                  }`}
                  data-aos="fade-in"
                >
                  Something went wrong! Please try again.
                </div>
              )}

              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your Name"
                      onChange={handleFieldChange("name")}
                    />
                    {fieldErrors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      onChange={handleFieldChange("email")}
                    />
                    {fieldErrors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-1"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Subject"
                    onChange={handleFieldChange("subject")}
                  />
                  {fieldErrors.subject && (
                    <p className="text-sm text-red-500 mt-1">
                      {fieldErrors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your Message"
                    rows={5}
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
                  className="w-full mt-2"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Contact;
