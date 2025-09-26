
'use client';

import { updateStudentPredictionAction } from "@/actions/student-actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";


export function UpdatePredictionButton({ studentId }: { studentId: string}) {
    const { toast } = useToast();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
  
    const handleUpdatePrediction = async () => {
      startTransition(async () => {
        try {
            const result = await updateStudentPredictionAction(studentId);
            if (result.success && result.prediction) {
                toast({
                    title: "Prediction Updated",
                    description: `New risk score is ${result.prediction.riskScore.toFixed(3)}. Page will refresh.`
                });
                router.refresh();
            } else {
                throw new Error(result.error || 'Failed to update prediction.');
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message
            });
        }
      });
    }

    return (
        <Button onClick={handleUpdatePrediction} disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Generate New Prediction
        </Button>
    )
}
