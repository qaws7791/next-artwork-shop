import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../../../../../components/ui/input";
interface PaymentFormProps {
  form: UseFormReturn<
    {
      cardholderName: string;
      cardNumber: string;
      expirationDate: string;
      cvcNumber: string;
    },
    any,
    undefined
  >;
}

export default function PaymentForm({ form }: PaymentFormProps) {
  // const onSubmit = form.handleSubmit((data) => {
  //   console.log("data", data);
  // });

  return (
    <div className="border rounded-lg p-8">
      <h3 className="text-2xl font-semibold">Payment</h3>
      <p className="text-muted-foreground">
        Please enter your payment information
      </p>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="cardholderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cardholder name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>The name on the card</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card number</FormLabel>
                <FormControl>
                  <Input placeholder="1234 1234 1234 1234" {...field} />
                </FormControl>
                <FormDescription>The 16 digits on the card</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-between">
            <div className="w-full">
              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration date</FormLabel>
                    <FormControl>
                      <Input placeholder="12/21" {...field} />
                    </FormControl>
                    <FormDescription>
                      The expiration date on the card
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="cvcNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVC number</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormDescription>
                      The 3 digits on the back of the card
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
