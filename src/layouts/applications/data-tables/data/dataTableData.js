/**
=========================================================
* AI EBOOK DASHBOARD React - v4.0.3
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

const dataTableData = {
  columns: [
    { Header: "name", accessor: "name", width: "20%" },
    { Header: "ic number", accessor: "icNumber", width: "25%" },
    { Header: "class", accessor: "class" },
    { Header: "age", accessor: "age", width: "7%" },
    { Header: "start date", accessor: "startDate" },
    { Header: "phone number", accessor: "phoneNumber" },
  ],

rows: [
  { name: "Ahmad Faiz", icNumber: "111105-10-2345", class: "Year 3", age: 12, startDate: "1/2/2023", phoneNumber: "012-3456 7890" },
  { name: "Nur Aisyah", icNumber: "120819-01-5678", class: "Year 5", age: 11, startDate: "1/2/2023", phoneNumber: "016-8765 4321" },
  { name: "Tan Wei Ling", icNumber: "131008-14-4321", class: "Year 7", age: 10, startDate: "1/2/2023", phoneNumber: "010-1234 5678" },
  { name: "Syafiq Azmi", icNumber: "100925-05-8765", class: "Year 4", age: 14, startDate: "1/2/2023", phoneNumber: "017-6543 2109" },
  { name: "Siti Nur Ain", icNumber: "111112-06-2345", class: "Year 3", age: 12, startDate: "1/2/2023", phoneNumber: "011-5432 1098" },
  { name: "Amirul Hakim", icNumber: "121119-07-5678", class: "Year 6", age: 11, startDate: "1/2/2023", phoneNumber: "018-4321 0987" },
  { name: "Aina Farhana", icNumber: "110729-08-8765", class: "Year 4", age: 12, startDate: "1/2/2023", phoneNumber: "019-7654 3210" },
  { name: "Mohd Irfan", icNumber: "140416-09-3456", class: "Year 1", age: 9, startDate: "1/2/2023", phoneNumber: "013-2345 6789" },
  { name: "Afiqah Hanim", icNumber: "120522-12-1234", class: "Year 5", age: 11, startDate: "1/2/2023", phoneNumber: "012-9876 5432" },
  { name: "Lim Zi Han", icNumber: "130717-11-7890", class: "Year 7", age: 10, startDate: "1/2/2023", phoneNumber: "010-5678 1234" },
  { name: "Muhammad Danish", icNumber: "111219-13-4567", class: "Year 3", age: 12, startDate: "1/2/2023", phoneNumber: "012-6543 2109" },
  { name: "Siti Fatimah", icNumber: "121012-05-0987", class: "Year 5", age: 11, startDate: "1/2/2023", phoneNumber: "014-3456 7890" },
  { name: "Rajesh Kumar", icNumber: "101203-10-7654", class: "Year 4", age: 14, startDate: "1/2/2023", phoneNumber: "017-8765 4321" },
  { name: "Nurul Iman", icNumber: "110714-01-4567", class: "Year 2", age: 13, startDate: "1/2/2023", phoneNumber: "016-1234 5678" },
  { name: "Amirah Zulaikha", icNumber: "120506-06-0987", class: "Year 6", age: 11, startDate: "1/2/2023", phoneNumber: "018-4321 0987" },
  { name: "Muhammad Aiman", icNumber: "140120-07-7654", class: "Year 1", age: 9, startDate: "1/2/2023", phoneNumber: "019-7654 3210" },
  { name: "Nur Alia", icNumber: "111227-03-1234", class: "Year 2", age: 12, startDate: "1/2/2023", phoneNumber: "011-5678 4321" },
  { name: "Syafiqah Nabila", icNumber: "120718-11-5678", class: "Year 6", age: 11, startDate: "1/2/2023", phoneNumber: "012-8765 4321" },
  { name: "Muhammad Adam", icNumber: "131009-14-0987", class: "Year 7", age: 10, startDate: "1/2/2023", phoneNumber: "010-3456 7890" },
  { name: "Nurul Ain", icNumber: "110513-08-7654", class: "Year 3", age: 12, startDate: "1/2/2023", phoneNumber: "017-2345 6789" },
  { name: "Amir Azlan", icNumber: "131225-02-4567", class: "Year 7", age: 10, startDate: "1/2/2023", phoneNumber: "013-8765 4321" },
  { name: "Nur Shafiqah", icNumber: "120215-11-6789", class: "Year 5", age: 11, startDate: "1/2/2023", phoneNumber: "016-5432 9876" },
  { name: "Muhammad Firdaus", icNumber: "101116-01-2345", class: "Year 4", age: 14, startDate: "1/2/2023", phoneNumber: "017-3210 8765" },
  { name: "Nur Aqilah", icNumber: "111220-06-5678", class: "Year 3", age: 12, startDate: "1/2/2023", phoneNumber: "011-7890 6543" },
  { name: "Muhammad Azfar", icNumber: "131107-14-8765", class: "Year 7", age: 10, startDate: "1/2/2023", phoneNumber: "010-4567 1234" },
  { name: "Nur Hanis", icNumber: "110928-02-3456", class: "Year 2", age: 13, startDate: "1/2/2023", phoneNumber: "012-6543 2109" },
  { name: "Siti Sarah", icNumber: "121105-05-7890", class: "Year 6", age: 11, startDate: "1/2/2023", phoneNumber: "014-9876 5432" },
  { name: "Ahmad Zikri", icNumber: "101018-08-4321", class: "Year 4", age: 14, startDate: "1/2/2023", phoneNumber: "017-3456 7890" },
  { name: "Nurul Syahira", icNumber: "131221-13-0987", class: "Year 7", age: 10, startDate: "1/2/2023", phoneNumber: "010-8765 4321" },
  { name: "Amalina Izzati", icNumber: "110311-09-7654", class: "Year 3", age: 12, startDate: "1/2/2023", phoneNumber: "013-1234 5678" },
  { name: "Chen Mei Ling", icNumber: "121124-07-2345", class: "Year 6", age: 11, startDate: "1/2/2023", phoneNumber: "018-4321 0987" },
  { name: "Nur Hidayah", icNumber: "101203-03-5678", class: "Year 4", age: 14, startDate: "1/2/2023", phoneNumber: "011-5432 1098" },
  { name: "Ahmad Fikri", icNumber: "110726-10-7890", class: "Year 3", age: 12, startDate: "1/2/2023", phoneNumber: "012-8765 4321" },
  { name: "Siti Khadijah", icNumber: "130807-12-0987", class: "Year 7", age: 10, startDate: "1/2/2023", phoneNumber: "010-3456 7890" },
  { name: "Ahmad Razi", icNumber: "120303-05-7654", class: "Year 4", age: 11, startDate: "1/2/2023", phoneNumber: "014-6543 2109" },
  { name: "Ramesh Nair", icNumber: "120919-09-2345", class: "Year 5", age: 11, startDate: "1/2/2023", phoneNumber: "016-7890 6543" },
  { name: "Nur Farah", icNumber: "130628-11-3456", class: "Year 6", age: 10, startDate: "1/2/2023", phoneNumber: "012-5678 4321" },
  { name: "Chong Wei Kiat", icNumber: "110719-08-4567", class: "Year 3", age: 12, startDate: "1/2/2023", phoneNumber: "017-4321 8765" },
  { name: "Sangeetha Devi", icNumber: "120105-02-5678", class: "Year 1", age: 11, startDate: "1/2/2023", phoneNumber: "011-6789 0123" },
  { name: "Nur Hazwani", icNumber: "111223-14-6789", class: "Year 7", age: 12, startDate: "1/2/2023", phoneNumber: "010-3210 7654" },
  { name: "Lim Kai Wen", icNumber: "121017-01-7890", class: "Year 5", age: 11, startDate: "1/2/2023", phoneNumber: "019-8765 4321" },
  { name: "Ahmad Syahir", icNumber: "131115-05-0987", class: "Year 4", age: 10, startDate: "1/2/2023", phoneNumber: "013-3456 9876" },
  { name: "Leong Siew Mei", icNumber: "110813-13-7654", class: "Year 3", age: 12, startDate: "1/2/2023", phoneNumber: "018-2345 6789" },
  { name: "Rajeshwari", icNumber: "101211-12-3456", class: "Year 2", age: 14, startDate: "1/2/2023", phoneNumber: "016-5432 1098" },
  { name: "Nur Amirah", icNumber: "120910-08-4321", class: "Year 5", age: 11, startDate: "1/2/2023", phoneNumber: "012-8765 0987" },
  { name: "Teh Zi Xuan", icNumber: "131215-04-5678", class: "Year 6", age: 10, startDate: "1/2/2023", phoneNumber: "017-6789 0123" },
  { name: "Anand Kumar", icNumber: "110217-03-6789", class: "Year 3", age: 13, startDate: "1/2/2023", phoneNumber: "011-8765 4321" },
  { name: "Nur Safwan", icNumber: "121115-11-7890", class: "Year 5", age: 11, startDate: "1/2/2023", phoneNumber: "019-3456 2109" },
  { name: "Chew Mei Ying", icNumber: "110510-02-0987", class: "Year 4", age: 13, startDate: "1/2/2023", phoneNumber: "010-6543 9876" },
  { name: "Shalini", icNumber: "120823-09-7654", class: "Year 2", age: 11, startDate: "1/2/2023", phoneNumber: "016-2345 6789" }
],

};

export default dataTableData;
