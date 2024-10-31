import { cn } from "@/lib/utils";
import { FieldEntity } from "@/types/form-config";

const withResponsiveWidthClasses =
  <T extends { field: FieldEntity }>(
    Component: React.FC<T>
  ) =>
  // eslint-disable-next-line react/display-name
  ({ ...props }: T) => {
    const { field } = props;
    return (
      <Component
        {...props}
        className={cn("w-full", {
          "md:w-[calc(75%-12px)]": field?.width === "75%",
          "md:w-[calc(50%-12px)]": field?.width === "50%",
          "md:w-[calc(25%-12px)]": field?.width === "25%",
          "w-full": field?.width === "100%" || field?.width === "75%" ||  field?.width === "50%" ,
          "w-[calc(75%-12px)]":  field?.width === "25%",
        })}
      />
    );
  };

export default withResponsiveWidthClasses;
