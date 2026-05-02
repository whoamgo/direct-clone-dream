import { Layout } from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  ["Are all medicines genuine?", "Yes — we source directly from authorized distributors and verified manufacturers. Every batch is checked for authenticity and expiry."],
  ["What are your delivery timelines?", "Same-day delivery in metro cities for orders placed before 2 PM. Standard delivery takes 2–4 business days nationwide."],
  ["Do I need a prescription to order?", "Prescription medicines require a valid Rx upload at checkout. Non-prescription items can be ordered freely."],
  ["What is your return policy?", "Sealed and unopened products can be returned within 7 days of delivery. Medicines once delivered cannot be returned for safety reasons."],
  ["How do I track my order?", "You'll receive a tracking link via SMS and email once your order is shipped."],
  ["Do you offer discounts?", "Yes — we run regular sales of up to 25% off and offer a loyalty program for returning customers."],
];

const FAQ = () => (
  <Layout>
    <div className="container-page py-10 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center">Frequently Asked Questions</h1>
      <p className="text-center text-muted-foreground mt-2 mb-8">Answers to common questions about ordering, delivery, and returns.</p>
      <Accordion type="single" collapsible className="bg-card border border-border rounded-lg px-4">
        {faqs.map(([q, a], i) => (
          <AccordionItem key={i} value={`i-${i}`}>
            <AccordionTrigger className="text-left">{q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </Layout>
);
export default FAQ;
