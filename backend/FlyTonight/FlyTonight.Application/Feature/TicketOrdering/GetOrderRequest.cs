using FluentValidation;
using FlyTonight.Domain.Interfaces;
using MediatR;

namespace FlyTonight.Application.Feature.TicketOrdering
{
    public class GetOrdersValidator : AbstractValidator<GetOrdersRequest>
    {
        public GetOrdersValidator()
        {
            RuleFor(o => o.UserId).NotEmpty();
        }
    }

    public class GetOrdersRequest : IRequest<GetOrdersResponse>
    {
        public string UserId { get; set; }
    }

    public class GetOrdersResponse
    {
        public class Flight
        {
            public string From { get; set; }
            public string To { get; set; }
            public DateTime Departure { get; set; }
            public bool IsReturn { get; set; }
        }

        public class Order
        {
            public Guid Id { get; set; }
            public int PassengerCount { get; set; }
            public int Price { get; set; }
            public Flight ToFlight { get; set; }
            public string ToFlightStatus { get; set; }
            public Flight ReturnFlight { get; set; }
            public string ReturnFlightStatus { get; set; }
        }

        public IList<Order> Orders { get; set; }
    }

    public class GetOrderHandler : IRequestHandler<GetOrdersRequest, GetOrdersResponse>
    {
        private readonly IOrderRepository orderRepository;

        public GetOrderHandler(IOrderRepository orderRepository)
        {
            this.orderRepository = orderRepository;
        }

        public async Task<GetOrdersResponse> Handle(GetOrdersRequest request, CancellationToken cancellationToken)
        {
            var orders = await orderRepository.GetUserOrders(request.UserId, cancellationToken);

            return new GetOrdersResponse
            {
                Orders = orders.Select(o =>
                {
                    var toFlight = o.Tickets.First(t => t.IsReturn == false).Reservation.Flight;
                    var returnFlight = o.Tickets.FirstOrDefault(t => t.IsReturn == true)?.Reservation.Flight;

                    return new GetOrdersResponse.Order
                    {
                        Id = o.Id,
                        Price = o.Price,
                        PassengerCount = o.HasReturn == true ? o.Tickets.Count / 2 : o.Tickets.Count,
                        ToFlight = new GetOrdersResponse.Flight
                        {
                            IsReturn = false,
                            From = toFlight.From.Name,
                            To = toFlight.To.Name,
                            Departure = toFlight.TimeOfDeparture
                        },
                        ToFlightStatus = toFlight.EnvEvent?.StatusMessage ?? string.Empty,
                        ReturnFlight = returnFlight is not null ? new GetOrdersResponse.Flight
                        {
                            IsReturn = true,
                            From = returnFlight.From.Name,
                            To = returnFlight.To.Name,
                            Departure = returnFlight.TimeOfDeparture,
                        } : null,
                        ReturnFlightStatus = returnFlight is not null ? returnFlight.EnvEvent?.StatusMessage ?? string.Empty : string.Empty
                    };
                })
                .OrderBy(o => o.ToFlight.Departure)
                .ToList()
            };
        }
    }
}