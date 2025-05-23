
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { House, NoteCategory, NoteArea } from "@/types";

interface AddNoteModalProps {
  isOpen: boolean;
  house: House;
  onClose: () => void;
  onSave: (category: NoteCategory, area: NoteArea, content: string) => void;
  isPending: boolean;
}

export default function AddNoteModal({ 
  isOpen, 
  house, 
  onClose, 
  onSave,
  isPending 
}: AddNoteModalProps) {
  const [formData, setFormData] = useState({
    category: "critical" as NoteCategory,
    area: "otro" as NoteArea,
    content: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos a enviar:", formData);
    if (!formData.category || !formData.area || !formData.content.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }
    onSave(formData.category, formData.area as NoteArea, formData.content);
  };

  const handleClose = () => {
    setFormData({
      category: "critical",
      area: "otro",
      content: ""
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir Nota para {house?.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label className="block text-sm font-medium text-slate-700 mb-1">Categoría de la Nota</Label>
            <RadioGroup 
              value={formData.category} 
              onValueChange={(value) => setFormData({...formData, category: value as NoteCategory})}
              className="flex gap-2"
            >
              <div className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-slate-50">
                <RadioGroupItem value="critical" id="critical" />
                <Label htmlFor="critical" className="flex items-center">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-[hsl(var(--critical))] text-white rounded">Grave</span>
                </Label>
              </div>
              
              <div className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-slate-50">
                <RadioGroupItem value="minor" id="minor" />
                <Label htmlFor="minor" className="flex items-center">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-[hsl(var(--minor))] text-white rounded">Leve</span>
                </Label>
              </div>
              
              <div className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-slate-50">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="flex items-center">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-500 text-white rounded">Otra</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mb-4">
            <Label className="block text-sm font-medium text-slate-700 mb-1">Área</Label>
            <Select value={formData.area} onValueChange={(value: NoteArea) => setFormData({...formData, area: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasfiteria">Gasfitería</SelectItem>
                <SelectItem value="electricidad">Electricidad</SelectItem>
                <SelectItem value="reposicion">Reposición</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="note-content" className="block text-sm font-medium text-slate-700 mb-1">
              Contenido de la Nota
            </Label>
            <Textarea 
              id="note-content" 
              rows={4} 
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Escribe tu nota aquí..." 
              className="w-full"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.category || !formData.area || !formData.content.trim() || isPending}
              className="bg-blue-800 hover:bg-blue-900"
            >
              {isPending ? "Guardando..." : "Guardar Nota"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
