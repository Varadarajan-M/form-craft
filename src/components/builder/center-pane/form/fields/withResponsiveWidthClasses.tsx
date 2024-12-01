import { cn } from '@/lib/utils';
import { FieldEntity } from '@/types/form-config';

const withResponsiveWidthClasses =
  <T extends { field: FieldEntity }>(Component: React.FC<T>) =>
  // eslint-disable-next-line react/display-name
  ({ ...props }: T) => {
    const { field } = props;
    return (
      <Component
        {...props}
        className={cn('w-full', {
          'lg:w-[calc(75%-12px)] w-full': field?.width === '75%',
          'lg:w-[calc(50%-12px)] w-full': field?.width === '50%',
          'lg:w-[calc(25%-12px)] w-full': field?.width === '25%',
        })}
      />
    );
  };

export default withResponsiveWidthClasses;
