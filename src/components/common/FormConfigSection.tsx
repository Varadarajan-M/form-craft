import { cn } from '@/lib/utils';
import { GenericProps } from '@/types/common';

interface FormSectionProps extends GenericProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const FormConfigSection = ({ className, icon, subtitle, title, children }: FormSectionProps) => {
  const classes = cn('flex flex-col gap-4 mb-2', className);

  return (
    <section className={classes}>
      <div className="flex flex-col">
        <div className="flex items-start gap-2">
          {icon}
          <h3 className="-mt-2 font-extrabold text-white/90 text-sm md:text-lg"> {title}</h3>
        </div>
        {subtitle && <small className="-mt-0.5 ml-6 text-xs font-[500] text-muted-foreground">{subtitle}</small>}
      </div>

      {children}
    </section>
  );
};

export default FormConfigSection;
