import React from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Upload } from 'lucide-react';
import { type Project } from '../types/entities';

interface InstructionsScreenProps {
  project?: Project;
}

export function InstructionsScreen({ project }: InstructionsScreenProps) {
  return (
    <div className="space-y-6 pb-[21px] p-[0px]">
      {/* Header */}
      <div className="border-b border-border px-[0px] py-[14px] mt-[0px] mr-[0px] mb-[16px] ml-[0px]">
        <div className="flex items-center justify-between mb-3">
          <h3>Project Instructions</h3>
        </div>
        <p className="text-muted-foreground">Provide specific instructions and context for this project</p>
      </div>

      {/* Custom Instructions Section */}
      <div className="bg-muted/30 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="font-medium text-foreground mb-1">Project Plan/Scope</h3>
          <p className="text-muted-foreground">Define the project scope, objectives, and key deliverables for this migration</p>
        </div>
        
        <div className="space-y-2">
          <Label>Project Scope & Objectives</Label>
          <Textarea
            placeholder="Define the project scope, migration objectives, key deliverables, timeline expectations, and success criteria. Include business requirements, technical constraints, stakeholder expectations, and any specific migration phases or milestones..."
            className="min-h-[400px] resize-none whitespace-pre-wrap break-all"
          />
          <p className="text-muted-foreground">This project plan will guide the AI agents and help scope tasks and deliverables for this migration project.</p>
        </div>

        <div className="flex justify-end">
          <Button 
            size="sm"
            onClick={() => {
              // TODO: Implement save functionality
              console.log('Save project instructions');
            }}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Supporting Documents Section */}

    </div>
  );
}