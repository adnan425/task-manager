import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Option {
    label: string;
    value: string;
}

interface FormFieldWrapperProps {
    control: any;
    name: string;
    label: string;
    placeholder?: string;
    type?: "text" | "textarea" | "select";
    options?: Option[];
}
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
export function FormFieldWrapper({
    control,
    name,
    label,
    placeholder,
    type = "text",
    options = [],
}: FormFieldWrapperProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        {type === "textarea" ? (
                            <Textarea placeholder={placeholder} {...field} />
                        ) : type === "select" ? (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {
                                                capitalize(option?.label)
                                            }
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input placeholder={placeholder} {...field} />
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
