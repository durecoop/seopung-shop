import Link from 'next/link';
import { formatPrice } from '@/lib/types';
import type { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.categorySlug}/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-ocean-300 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <div className="flex h-full items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="h-16 w-16 text-gray-200 transition-transform duration-500 group-hover:scale-110">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
          </svg>
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {discount > 0 && <span className="rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{discount}%</span>}
          {product.isNew && <span className="rounded-md bg-ocean-500 px-2 py-0.5 text-xs font-bold text-white">NEW</span>}
          {product.tags.includes('인기') && <span className="rounded-md bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">인기</span>}
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400">{product.weight}</p>
        <h3 className="mt-1 text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-ocean-600 transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-gray-400 line-clamp-1">{product.description}</p>

        <div className="mt-3 flex items-baseline gap-2">
          {product.originalPrice && (
            <span className="font-montserrat text-xs text-gray-300 line-through">{formatPrice(product.originalPrice)}</span>
          )}
          <span className="font-montserrat text-lg font-bold text-ocean-600">{formatPrice(product.price)}</span>
          <span className="text-xs text-gray-400">원</span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {product.tags.filter(t => t !== '인기').slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] text-gray-500">{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
