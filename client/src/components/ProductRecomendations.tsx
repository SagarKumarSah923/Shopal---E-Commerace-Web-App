import React, { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface Props {
  productId: string;
}

const ProductRecommendations: React.FC<Props> = ({ productId }) => {
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const res = await fetch(`/api/ai/recommend/${productId}`);
      const data = await res.json();
      setRecommended(data.recommended || []);
    };
    fetchRecommendations();
  }, [productId]);

  return (
    <div className="mt-8">
      <h4 className="text-lg font-semibold mb-2">Recommended Products</h4>
      <ul className="grid grid-cols-2 gap-4">
        {recommended.map((product) => (
          <li key={product.id} className="border p-2 rounded shadow">
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-gray-600">₹{product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductRecommendations;