import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";

const IconeCarrinho = () => {
  return (
    <>
      <Sheet>
        <SheetTrigger>
          {" "}
          <ShoppingCart size={20} className="text-white" />
        </SheetTrigger>
        <SheetContent className="bg-gray-800">
          <SheetHeader>
            <SheetTitle className="text-white">Seu carrinho: </SheetTitle>
            <SheetDescription className="text-white">
              Itens do carrinho
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default IconeCarrinho;
