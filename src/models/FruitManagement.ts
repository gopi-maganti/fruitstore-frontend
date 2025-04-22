export interface Fruit {
  fruit_id: number;
  info_id: number;
  name: string;
  color: string;
  size: string;
  image_url: string;
  has_seeds: boolean;
  weight: number;
  total_quantity: number;
  price: number;
  available_quantity: number;
  description: string;
  sell_by_date: string;
}

export interface FruitFormData {
  name: string;
  description?: string;
  color: string;
  size: string;
  has_seeds: boolean;
  weight: number;
  price: number;
  total_quantity: number;
  available_quantity: number;
  sell_by_date: string;
  image: File | null;
  fruit_id?: number;
}

export interface FruitModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  initialData?: Partial<FruitFormData>;    
  isEditing?: boolean;
}

export interface FruitEditData {
  fruit_id: number;
  name: string;
  price: number;
  total_quantity: number;
  available_quantity: number;
}