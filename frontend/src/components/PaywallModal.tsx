"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock } from "lucide-react"; // Import icons

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, onUnlock }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Unlock Your First Report
          </DialogTitle>
          <DialogDescription className="text-center">
            You're one step away from a polished, shareable report. Start your free trial to download this report and unlock all premium features.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Export Polished, Executive-Level Reports</span>
            </li>
            <li className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Access Advanced AI Coaching Personas</span>
            </li>
            <li className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Track Your Cognitive Fingerprint Over Time</span>
            </li>
          </ul>
        </div>
        <DialogFooter className="flex flex-col gap-2">
          <Button onClick={onUnlock} className="w-full">
            Start 7-Day Free Trial
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallModal;