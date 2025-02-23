import React, { useEffect, useState } from 'react';
import FieldConfigMenu from './field-config-menu/FieldConfigMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { cn } from '@/lib/utils';
import { GenericProps } from '@/types/common';
import { useSelectedFieldStore } from '@/zustand/store';
import FieldListMenu from './field-list-menu/FieldListMenu';

const RightPane = ({ className }: GenericProps) => {
  const classes = cn('h-full bg-background p-4 pt-0 flex flex-col gap-6 overflow-auto', className);
  const selectedField = useSelectedFieldStore((s) => s?.selectedField);
  const [selected, setSelected] = useState('fields');

  useEffect(() => {
    setSelected(selectedField ? 'settings' : 'fields');
  }, [selectedField]);

  return (
    <div className={classes}>
      <Tabs value={selected} className="w-full">
        <TabsList className="w-full flex justify-between sticky top-1 z-10 backdrop:blur-md">
          <TabsTrigger value="fields" className="basis-1/2" onClick={() => setSelected('fields')}>
            Fields
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="basis-1/2"
            disabled={!selectedField}
            onClick={() => setSelected('settings')}
          >
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="fields" className="mt-6">
          <FieldListMenu />
        </TabsContent>
        <TabsContent value="settings" className="mt-6 flex flex-col gap-8">
          <FieldConfigMenu />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightPane;
