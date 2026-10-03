namespace iDealMackolicUI.Dtos.MatchDtos
{
	public class CreateMatchDto
	{
		public int HomeTeamId { get; set; }
		public int AwayTeamId { get; set; }
		public DateTime MatchDate { get; set; }
		public string Stadium { get; set; }
		public int Week { get; set; }
		public int HomeScore { get; set; }
		public int AwayScore { get; set; }
	}
}
