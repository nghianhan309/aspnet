//Sinh viên : Nguyễn Nghĩa Nhân
//MSSV:2123110146
//Lớp:CCQ2311E
//Ngày tạo: 15/05/2026
//Mô tả: Quản lí Banner
using System;
using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class Banner
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Tiêu đề không được để trống")]
        [StringLength(200, ErrorMessage = "Tiêu đề không được quá 200 ký tự")]
        [Display(Name = "Tiêu đề")]
        public string Title { get; set; }

        [Display(Name = "Hình ảnh")]
        public string? ImageUrl { get; set; }

        [StringLength(500, ErrorMessage = "Link không được quá 500 ký tự")]
        [Display(Name = "Đường dẫn (Link)")]
        public string? Link { get; set; }

        [Display(Name = "Thứ tự hiển thị")]
        public int DisplayOrder { get; set; } = 0;

        [Display(Name = "Hiển thị (Bật/Tắt)")]
        public bool IsActive { get; set; } = true;

        [Display(Name = "Ngày tạo")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
