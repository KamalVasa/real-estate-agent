export const BUSINESS = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME || "Dombivli Property AI",
  phone: process.env.NEXT_PUBLIC_PHONE || "+91 98765 43210",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP || "919876543210").replace(/\D/g, ""),
  email: process.env.NEXT_PUBLIC_EMAIL || "hello@dombivliproperty.ai",
};

export const whatsappUrl = (message: string) =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
