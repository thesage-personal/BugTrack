namespace BugTrack.Models
{
    public class ProblemReport
    {
        public int prId { get; set; }
        public string prnumber { get; set; }
        public string description { get; set; }
        public string status { get; set; }
        public string originator { get; set; }
        public DateTime dateOriginated { get; set; }
        public DateTime? dateCompleted { get; set; } = null;
        public string priority { get; set; }
        public string prFixer { get; set; }
        public string prIntroducer { get; set; }
        public string project { get; set; }
        public string dDescription { get; set; }
        public DateTime? etaFixing { get; set; } = null;
    }
    public class User
    {
        public int UserId { get; set; }
        public string? Username { get; set; } 
        public string? Password { get; set; } 
        public string? Designation { get; set; }
        public string? Role { get; set; }
        public int RoleId { get; set; }
    }

    public static class SUserDetails
    {
        public static int UserId { get; set; }
        public static string Username { get; set; } = String.Empty;
        public static string Password { get; set; } = String.Empty;
        public static string Designation { get; set; } = String.Empty;
        public static string Role { get; set; } = String.Empty;
        public static int RoleId { get; set; }
    }
    public class Projects
    {
        public int ProjectId { get; set; }
        public string Project { get; set; }
    }
    public class Comments
    {
        public int CommentsId { get; set; }
        public int PrId { get; set; }
        public string Originator { get; set; }
        public string Receiver { get; set; }
        public string Statement { get; set; }
        public DateTime CommentedOn { get; set; }
    }
}



