import {
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

interface Props {
    title: string,
    description: string
}
const AuthHeader = ({ title, description }: Props) => {
    return (
        <CardHeader className="text-center">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
    )
}

export default AuthHeader