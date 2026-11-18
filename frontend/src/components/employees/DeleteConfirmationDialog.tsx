"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Employee } from "@/types";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  employee: Employee | null;
  isLoading?: boolean;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  employee,
  isLoading = false,
}: DeleteConfirmationDialogProps) {
  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus Data Pegawai"
      description="Tindakan ini permanen dan tidak dapat dibatalkan."
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs text-slate-300">
            <p className="font-semibold text-white">
              Apakah Anda yakin ingin menghapus pegawai ini?
            </p>
            <p>
              Pegawai <span className="font-semibold text-rose-300">{employee.nama}</span> (NIP:{" "}
              <span className="font-mono text-slate-200">{employee.nip}</span>) akan dihapus secara permanen dari sistem.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Hapus Pegawai
          </Button>
        </div>
      </div>
    </Modal>
  );
}

