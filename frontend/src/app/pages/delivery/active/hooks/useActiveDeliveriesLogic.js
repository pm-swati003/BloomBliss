import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  useDeliveryOrders,
  useDeliveryUpdateLocation,
  useDeliveryMarkDelivered,
} from "@/lib/api/hooks/useDelivery";

export function useActiveDeliveriesLogic() {
  const { data: orders = [], isLoading } = useDeliveryOrders("active");
  const updateLocation = useDeliveryUpdateLocation();
  const markDelivered = useDeliveryMarkDelivered();

  const [locationSharing, setLocationSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const watchIdRef = useRef(null);
  const intervalRef = useRef(null);

  const displayOrders = orders;

  useEffect(() => {
    if (orders.length > 0 && !selectedOrderId) setSelectedOrderId(orders[0].id);
  }, [orders, selectedOrderId]);

  const startLocationSharing = (orderId) => {
    setSelectedOrderId(orderId);
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocation is not supported");
      return;
    }
    setLocationError(null);
    setLocationSharing(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        setLocationError(err.message);
        setLocationSharing(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (!locationSharing || !selectedOrderId) return;
    const id = setInterval(() => {
      if (currentLocation) {
        updateLocation.mutate({
          id: selectedOrderId,
          rider_lat: currentLocation.latitude,
          rider_lng: currentLocation.longitude,
        });
      }
    }, 10000);
    intervalRef.current = id;
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [locationSharing, selectedOrderId, currentLocation]);

  const stopLocationSharing = () => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setLocationSharing(false);
    setCurrentLocation(null);
  };

  const handleMarkDelivered = (orderId) => {
    if (selectedOrderId === orderId) stopLocationSharing();
    
    // Simulate a distance between 2 and 15 km for prototype purposes
    const distance_km = Math.round((Math.random() * 13 + 2) * 10) / 10;
    
    markDelivered.mutate({ id: orderId, distance_km }, {
      onSuccess: () => toast.success("Order marked as delivered. Earnings updated!"),
      onError: (e) => toast.error(e?.response?.data?.message ?? "Failed to update"),
    });
  };

  const openInMaps = (address) => {
    const encoded = encodeURIComponent(address);
    if (navigator.userAgent.match(/iPhone|iPad|iPod/)) {
      window.open(`http://maps.apple.com/?q=${encoded}`);
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
    }
  };

  return {
    displayOrders,
    isLoading,
    locationSharing,
    currentLocation,
    locationError,
    selectedOrderId,
    startLocationSharing,
    stopLocationSharing,
    handleMarkDelivered,
    openInMaps,
    markDeliveredPending: markDelivered.isPending,
  };
}
