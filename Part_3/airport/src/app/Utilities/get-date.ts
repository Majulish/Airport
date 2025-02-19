class getDate {
  getUpcomingDate(daysFromNow: number, hoursFromMidnight: number = 0, minutesFromMidnight: number = 0): Date {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(hoursFromMidnight, minutesFromMidnight, 0, 0);
    return date;
  }

  public formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

export const date = new getDate();
