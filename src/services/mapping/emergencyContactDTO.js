export function mapToEmergencyContacts(emergencyContactsDTO) {
    return emergencyContactsDTO.map(function(item) {
        return item.data;
    });
}