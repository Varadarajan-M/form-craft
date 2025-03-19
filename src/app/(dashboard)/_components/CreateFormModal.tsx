import ComingSoonBadge from '@/components/common/ComingSoonBadge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateFormMutation } from '@/data-fetching/client/form';
import { useFormActionProperty } from '@/zustand/store';
import { LucideBuilding, PuzzleIcon, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

interface CreateFormModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

const FormCreationOption = ({
  icon: Icon,
  title,
  onClick,
  isActive = true,
}: {
  icon: React.ElementType;
  title: string;
  onClick?: () => void;
  isActive?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className="rounded-lg relative cursor-pointer border-dashed border hover:border-yellow-200/30 px-2 py-6 grid place-items-center bg-card group"
    >
      <Icon className="w-6 h-6 text-muted-foreground" />
      <p className="mt-2 text-center text-sm gradient-text">{title}</p>
      {!isActive && <ComingSoonBadge className="mt-2" />}
    </div>
  );
};

const CreateFormModal = ({ open, setOpen, className }: CreateFormModalProps) => {
  const router = useRouter();
  const setFormConfig = useFormActionProperty('setFormConfig');

  const mutate = useCreateFormMutation({
    onMutate: () => {
      setOpen(false);
      const toastId = toast.loading('Creating form...');
      return toastId as string;
    },
    onSuccess: (data, context) => {
      toast.dismiss(context as string);
      if (data?.id) {
        setFormConfig(data);
        toast.success('Form created successfully!', {
          style: { background: '#000', color: '#fff' },
        });
        setTimeout(() => router.push('/builder'), 1000);
      }
    },
  });

  const handleWithTemplateOption = () => {
    setOpen(false);
    router.push('/templates');
  };

  const handleBuildFromScratch = () => {
    mutate(void null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={className}>
        <Button variant="default" size={'sm'}>
          Create a new form
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle>New Form</DialogTitle>
          <DialogDescription>Choose how you want to create your form.</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 my-8">
          <FormCreationOption onClick={handleBuildFromScratch} icon={PuzzleIcon} title="Build from scratch" />
          <FormCreationOption onClick={handleWithTemplateOption} icon={LucideBuilding} title="Start with a template" />
          <FormCreationOption isActive={false} icon={Sparkles} title="Build with AI ✨" />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className="btn" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFormModal;
