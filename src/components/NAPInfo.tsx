import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import { businessInfo } from '../config/businessInfo';

interface NAPInfoProps {
  variant?: 'full' | 'compact' | 'inline';
  showIcons?: boolean;
  className?: string;
  itemScope?: boolean;
}

const NAPInfo: React.FC<NAPInfoProps> = ({
  variant = 'full',
  showIcons = true,
  className = '',
  itemScope = true
}) => {
  const napData = itemScope ? {
    itemScope: true,
    itemType: "http://schema.org/LocalBusiness"
  } : {};

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-4 text-sm ${className}`} {...napData}>
        <div className="flex items-center gap-2">
          {showIcons && <MapPin className="w-4 h-4 text-blue-400" />}
          <span itemProp="address" itemScope itemType="http://schema.org/PostalAddress">
            <span itemProp="streetAddress">{businessInfo.address.streetAddress}</span>,{' '}
            <span itemProp="addressLocality">{businessInfo.address.addressLocality}</span>,{' '}
            <span itemProp="addressRegion">{businessInfo.address.addressRegion}</span>{' '}
            <span itemProp="postalCode">{businessInfo.address.postalCode}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {showIcons && <Phone className="w-4 h-4 text-green-400" />}
          <a
            href={`tel:${businessInfo.contact.phone}`}
            itemProp="telephone"
            className="hover:text-blue-400 transition-colors"
          >
            {businessInfo.contact.phoneDisplay}
          </a>
        </div>
        <div className="flex items-center gap-2">
          {showIcons && <Mail className="w-4 h-4 text-purple-400" />}
          <a
            href={`mailto:${businessInfo.contact.email}`}
            itemProp="email"
            className="hover:text-blue-400 transition-colors"
          >
            {businessInfo.contact.email}
          </a>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`} {...napData}>
        <meta itemProp="name" content={businessInfo.name} />
        <div className="flex items-start gap-2 text-sm">
          {showIcons && <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />}
          <span itemProp="address" itemScope itemType="http://schema.org/PostalAddress">
            <span itemProp="streetAddress">{businessInfo.address.streetAddress}</span><br />
            <span itemProp="addressLocality">{businessInfo.address.addressLocality}</span>,{' '}
            <span itemProp="addressRegion">{businessInfo.address.addressRegion}</span>{' '}
            <span itemProp="postalCode">{businessInfo.address.postalCode}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {showIcons && <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />}
          <a
            href={`tel:${businessInfo.contact.phone}`}
            itemProp="telephone"
            className="hover:text-blue-400 transition-colors"
          >
            {businessInfo.contact.phoneDisplay}
          </a>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {showIcons && <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />}
          <a
            href={`mailto:${businessInfo.contact.email}`}
            itemProp="email"
            className="hover:text-blue-400 transition-colors"
          >
            {businessInfo.contact.email}
          </a>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...napData}
    >
      <div>
        <h3 className="text-2xl font-bold text-white mb-4" itemProp="name">
          {businessInfo.name}
        </h3>
        <meta itemProp="description" content={businessInfo.description} />
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          {showIcons && (
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-400" />
            </div>
          )}
          <div>
            <p className="text-sm text-gray-400 mb-1">Address</p>
            <div itemProp="address" itemScope itemType="http://schema.org/PostalAddress" className="text-white">
              <div itemProp="streetAddress">{businessInfo.address.streetAddress}</div>
              <div>
                <span itemProp="addressLocality">{businessInfo.address.addressLocality}</span>,{' '}
                <span itemProp="addressRegion">{businessInfo.address.addressRegion}</span>{' '}
                <span itemProp="postalCode">{businessInfo.address.postalCode}</span>
              </div>
              <meta itemProp="addressCountry" content={businessInfo.address.addressCountry} />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          {showIcons && (
            <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-green-400" />
            </div>
          )}
          <div>
            <p className="text-sm text-gray-400 mb-1">Phone</p>
            <a
              href={`tel:${businessInfo.contact.phone}`}
              itemProp="telephone"
              className="text-white hover:text-blue-400 transition-colors font-medium"
            >
              {businessInfo.contact.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          {showIcons && (
            <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-400" />
            </div>
          )}
          <div>
            <p className="text-sm text-gray-400 mb-1">Email</p>
            <a
              href={`mailto:${businessInfo.contact.email}`}
              itemProp="email"
              className="text-white hover:text-blue-400 transition-colors font-medium"
            >
              {businessInfo.contact.email}
            </a>
          </div>
        </div>
      </div>

      <meta itemProp="url" content={businessInfo.urls.website} />
      <meta itemProp="priceRange" content="$$$" />
    </motion.div>
  );
};

export default NAPInfo;
