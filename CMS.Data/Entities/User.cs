//Sinh viên : Nguyễn Nghĩa Nhân
//MSSV:2123110146
//Lớp:CCQ2311E
//Ngày tạo: 15/05/2026
//Mô tả: Quản lí Người Dùng
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; } // Quản trị viên hoặc Biên tập viên
    }

}
