export const hasOverLappingReservations = async (client, parkingSpotId, startTime, endTime) => {
    const overlap = await client.query(
        `SELECT 1 FROM reservations
         WHERE parking_spot_id = $1
           AND status = 'reserved'
           AND NOT ($3 <= start_time OR $2 >= end_time)`,
        [parkingSpotId, new Date(startTime), new Date(endTime)]
    );
    return overlap?.rows?.length ?? 0;
}