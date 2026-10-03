namespace iDealMackolikAPI.Dtos
{
	public class CreateMatchDto
	{
		public int HomeTeamId { get; set; }
		public int AwayTeamId { get; set; }
		public DateTime MatchDate { get; set; }
		public string Stadium { get; set; }
	}
}
