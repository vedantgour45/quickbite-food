import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Loader2,
  Lock,
  Locate,
  Truck,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import type { Customer } from '@/types';
import { cn } from '@/utils/cn';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid phone number'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
});

export type DeliveryFormValues = z.infer<typeof schema>;

interface Props {
  onSubmit: (values: Customer) => void;
  isSubmitting: boolean;
  totalLabel: string;
}

interface NominatimResponse {
  address?: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
  };
  display_name?: string;
}

export const DeliveryForm = ({
  onSubmit,
  isSubmitting,
  totalLabel,
}: Props) => {
  const { show } = useToast();
  const [locating, setLocating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<DeliveryFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const useCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      show('Geolocation is not supported in this browser.', 'error');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&addressdetails=1`;
          const res = await fetch(url, {
            headers: { Accept: 'application/json' },
          });
          if (!res.ok) throw new Error('reverse geocode failed');
          const data: NominatimResponse = await res.json();

          const a = data.address ?? {};
          const street = [a.house_number, a.road, a.neighbourhood, a.suburb]
            .filter(Boolean)
            .join(', ');
          const city = a.city ?? a.town ?? a.village ?? '';
          const stateLine = [city, a.state].filter(Boolean).join(', ');
          const address =
            [street, stateLine].filter((s) => s.trim().length).join(', ') ||
            data.display_name ||
            `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;

          setValue('address', address, { shouldValidate: true });
          if (a.postcode && /^\d{6}$/.test(a.postcode)) {
            setValue('pincode', a.postcode, { shouldValidate: true });
          }
          show('Location detected — address filled in.');
        } catch {
          // Fallback: at least fill in the coordinates so the user has a starting point.
          setValue(
            'address',
            `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`,
            { shouldValidate: true },
          );
          show('Used coordinates — please refine the address.');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        const msg =
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied.'
            : 'Could not get your location.';
        show(msg, 'error');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleInvalidSubmit = () => {
    // RHF already attaches errors; trigger() ensures every field is validated
    // so all empty inputs go red, not just the touched ones.
    void trigger();
  };

  return (
    <form
      onSubmit={handleSubmit(
        (values) => onSubmit(values),
        handleInvalidSubmit,
      )}
      className="space-y-6"
      noValidate
    >
      <section className="bg-white rounded-2xl border border-brand-50 shadow-sm p-6 space-y-5">
        <header className="flex items-center gap-3 pb-4 border-b border-brand-50">
          <User className="h-5 w-5 text-brand-600" />
          <h2 className="text-lg font-bold text-gray-900">
            Contact Information
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            error={errors.name?.message}
            invalid={!!errors.name}
          >
            <Input
              placeholder="Alex Morgan"
              autoComplete="name"
              invalid={!!errors.name}
              {...register('name')}
            />
          </FormField>
          <FormField
            label="Phone Number"
            error={errors.phone?.message}
            invalid={!!errors.phone}
          >
            <Input
              placeholder="+91 98765 43210"
              autoComplete="tel-national"
              invalid={!!errors.phone}
              {...register('phone')}
            />
          </FormField>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-brand-50 shadow-sm p-6 space-y-5">
        <header className="flex items-center gap-3 pb-4 border-b border-brand-50">
          <Truck className="h-5 w-5 text-brand-600" />
          <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 disabled:opacity-60"
          >
            {locating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Locate className="h-3.5 w-3.5" />
            )}
            {locating ? 'Locating…' : 'Use Current Location'}
          </button>
        </header>

        <FormField
          label="Street Address"
          error={errors.address?.message}
          invalid={!!errors.address}
        >
          <Input
            placeholder="123, Jubilee Hills, Hyderabad"
            autoComplete="street-address"
            invalid={!!errors.address}
            {...register('address')}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Pincode"
            error={errors.pincode?.message}
            invalid={!!errors.pincode}
          >
            <Input
              placeholder="500033"
              inputMode="numeric"
              maxLength={6}
              autoComplete="postal-code"
              invalid={!!errors.pincode}
              {...register('pincode')}
            />
          </FormField>
          <FormField label="Delivery Instructions (optional)">
            <Textarea
              placeholder="Leave at door, ring bell..."
              className="min-h-11 h-11"
            />
          </FormField>
        </div>
      </section>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Place Order • {totalLabel}
          </>
        )}
      </Button>
      <p className="text-xs text-gray-400 text-center">
        By placing your order, you agree to our Terms of Service.
      </p>
    </form>
  );
};

interface FieldProps {
  label: string;
  error?: string;
  invalid?: boolean;
  children: React.ReactNode;
}

const FormField = ({ label, error, invalid, children }: FieldProps) => (
  <label className="block">
    <span
      className={cn(
        'block text-xs font-medium mb-1.5',
        invalid ? 'text-red-600' : 'text-gray-500',
      )}
    >
      {label}
    </span>
    {children}
    {invalid && error && (
      <span
        role="alert"
        className="mt-1.5 inline-flex items-center gap-1 text-xs text-red-600"
      >
        <AlertCircle className="h-3 w-3" />
        {error}
      </span>
    )}
  </label>
);
